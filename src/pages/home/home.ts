import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Announcement } from '../announcement/announcement';

import { DataApi } from '../../providers/data-api';
import { CheckDevice } from '../../providers/check-device';
import { Settings } from '../settings/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  slides: any;

  constructor(public navCtrl: NavController, public dataApi: DataApi, public checkDevice: CheckDevice) {
    this.checkAuth();
  }

  ionViewOnLoad() {
    
  }

  ionViewWillEnter() {

    if (this.dataApi.get('activate')) {
      this.slides = [
        {
          title: "Welcome to Mobile Time Attendance System",
          description:
          "Name: " + this.dataApi.get('name') + "<br>" +
          "Staff Number: " + this.dataApi.get('token'),
          image: "assets/image/prasarana.png",
        }
      ];
    } else {
      this.checkAuth();
    }
  }

  getNews() {
    this.navCtrl.push(Announcement);
  }

  checkAuth() {
    console.log('checkAuth');
    if (!this.dataApi.get('token')) {
      this.navCtrl.push(Settings);
    }
  }
}
