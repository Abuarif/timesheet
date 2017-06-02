import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker';
import { DataApi } from '../../providers/data-api';
import { Api } from '../../providers/api';
import { CheckDevice } from '../../providers/check-device';
import { ConnectivityService } from '../../providers/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';

import { Settings } from '../settings/settings';
import { TabsPage } from '../tabs/tabs';

declare var google;

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class Location {
  @ViewChild('map') mapElement: ElementRef;

  map: any;
  mapInitialised: boolean = false;
  apiKey: any = 'AIzaSyA8BxZKXjS4z7yFRvTDBzBbt0V9x7I17Ug';
  latLng: any;
  lat: number;
  long: number;
  account: any;
  active: any;
  isCheckedIn: boolean;
  private data: any;
  nativeDevice: boolean;

  constructor(
    public navCtrl: NavController,
    public locationTracker: LocationTracker,
    public alertCtrl: AlertController,
    public dataApi: DataApi,
    public api: Api,
    public geolocation: Geolocation,
    public _loadingController: LoadingController,
    public checkDevice: CheckDevice,
    public connectivityService: ConnectivityService
  ) {
    this.nativeDevice = this.checkDevice.nativeDevice;
  }

  ionViewWillEnter() {
    this.active = this.dataApi.get('activate');
    console.log('active: ' + this.active);
    if (this.active) {
      if (this.nativeDevice) {
        this.start();
      } else {
        this.loadGoogleMaps();
      }
      this.getHistory();
      this.isCheckedIn = (this.dataApi.get('isCheckedIn') == 'true');
    } else {
      this.navCtrl.push(Settings);
    }

  }
  start() {
    this.locationTracker.startTracking();
  }

  stop() {
    this.locationTracker.stopTracking();
  }

  private submitTags(direction: number) {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    let latitude: any;
    let longitude: any;
    let timestamp: any;

    loading.present();
    if (this.locationTracker.lat && this.locationTracker.lng) {
      latitude = this.locationTracker.lat;
      longitude = this.locationTracker.lng;
      timestamp = this.locationTracker.timestamp;
    } else {
      latitude = this.lat;
      longitude = this.long;
      timestamp = new Date();
    }
    //Submit Barcode
    this.api.submitTag(direction, latitude, longitude, timestamp)
      .then((result) => {
        loading.dismiss();
        this.data = result;
        this.submitted();
      }, (err) => {
        loading.dismiss();
        // Display submit barcode error code
        alert(err);
      });
  }

  submitNativeData() {
    let confirm = this.alertCtrl.create({
      title: 'Use this location?',
      message: 'Do you agree to use this location for your attendance?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked ');
            this.stop();
            this.submitTags(0);
          }
        }
      ]
    });
    confirm.present();

  }

  submitted() {
    let confirm = this.alertCtrl.create({
      title: 'Thank You',
      message: 'Your attendance is successfully submitted.',
      buttons: [
        {
          text: 'ok',
          handler: () => {
            console.log('ok clicked');
            this.navCtrl.setRoot(TabsPage);
          }
        },

      ]
    });
    confirm.present();

  }

  // googlemap javascript sdk

  loadMap() {
    console.log('loading map...');

    this.geolocation.getCurrentPosition().then((position) => {
      console.log('rendering map...');
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      console.log('setup map...');

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }

  loadGoogleMaps() {
    // this.debug('loadGoogleMaps');
    this.addConnectivityListeners();

    if (typeof google == "undefined" || typeof google.maps == "undefined") {

      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if (this.connectivityService.isOnline()) {
        console.log("online, loading map");

        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        if (this.apiKey) {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          console.log("API Key is available!");
        } else {
          script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
        }

        document.body.appendChild(script);

      }
    } else {

      if (this.connectivityService.isOnline()) {
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }
    }
  }

  loadScript() {
    let script = document.createElement("script");
    script.id = "googleMaps";

    if (this.apiKey) {
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey;
      console.log("API Key is available!");
    } else {
      script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap';
    }

    document.body.appendChild(script);
  }

  initMap() {
    this.presentLoading();

    this.geolocation.getCurrentPosition().then((position) => {
      this.mapInitialised = true;

      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;

      let mapOptions = {
        center: this.latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();

    }, (error) => {
      this.mapInitialised = false;
      console.log('Check GPS');
      this.enableGPS();
    });
  }

  enableGPS() {
    let alert = this.alertCtrl.create({
      title: 'GPS not available!',
      subTitle: 'Please enable your GPS.',
      buttons: ['OK']
    });
    alert.present();
  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

  addConnectivityListeners() {

    let onOnline = () => {

      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {

          this.loadGoogleMaps();

        } else {

          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }
      }, 1000);

    };

    let onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>You are here!</h4>"
      + "<br/>Latitude: " + this.lat
      + "<br/>Longitude: " + this.long;

    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Use this location?',
      message: 'Do you agree to use this location for your attendance?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked ' + this.latLng);
            let message = 'Your location is at: '
              + '<br/> Lat: ' + this.lat
              + '<br/> Long: ' + this.long;
            this.debug(message);
          }
        }
      ]
    });
    confirm.present();
  }

  debug(message) {
    let alert = this.alertCtrl.create({
      title: 'Information',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading() {
    this._loadingController.create({
      content: 'Loading ...',
      duration: 5000,
      dismissOnPageChange: true
    }).present();
  }

  isAllowed() {
    if (this.mapInitialised && this.dataApi.data.activate) {
      return true;
    } else {
      return false;
    }
  }

  canCheckIn() {
    if (!this.isCheckedIn) {
      return true;
    } else {
      return false;
    }
  }

  submitNonNativeData() {
    let confirm = this.alertCtrl.create({
      title: 'Use this location?',
      message: 'Do you agree to use this location for your check in?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked ' + this.lat + ', ' + this.long);
            this.submitTags(0);
          }
        }
      ]
    });
    confirm.present();

  }

  canCheckOut() {
    if (this.isCheckedIn) {
      return true;
    } else {
      return false;
    }
  }

  submitCheckOutData() {
    let confirm = this.alertCtrl.create({
      title: 'Use this location?',
      message: 'Do you agree to use this location for your check out?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked ' + this.latLng);
            this.submitTags(2);
          }
        }
      ]
    });
    confirm.present();
  }

  getHistory() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });
    loading.present();

    //Submit Barcode
    this.api.get_latest()
      .then((result) => {
        loading.dismiss();
        this.data = result;
        console.log(this.data);
        if (this.data.UserTag) {
          if (this.data.UserTag.direction == '1') {
            // change to checkout
            this.isCheckedIn = true;
          } else if (this.data.UserTag.direction == '2') {
            // change to checkin
            this.isCheckedIn = false;
          }
        }
        this.dataApi.update('isCheckedIn', this.isCheckedIn);
      }, (err) => {
        loading.dismiss();
        // Display submit barcode error code
        alert(err);
      });
  }
}
