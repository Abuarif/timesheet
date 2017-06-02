import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationTracker {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public address: string;
  public timestamp: any;

  constructor(public zone: NgZone, 
  private geolocation: Geolocation,
  private geocoder: NativeGeocoder,
  private backgroundGeolocation: BackgroundGeolocation) {

  }

  startTracking() {

    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        let houseNumber = '';
        let city = '';

        this.geocoder.reverseGeocode(this.lat, this.lng)
        .then((result: NativeGeocoderReverseResult) => {

          if(result.houseNumber) houseNumber = result.houseNumber;
          if (result.city) city = result.city;

          this.address = "The address is " + houseNumber + " " + result.street + " in " + city + ", " + result.countryCode;
          console.log("The address is " + result.street + " " + result.houseNumber + " in " + result.city + ", " + result.countryCode);
          this.timestamp = new Date();
        })
        .catch((error: any) => console.log(error));

      });

    }, (err) => {

      console.log(err);

    });

    

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.timestamp = new Date();
      });

    });

  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }

}