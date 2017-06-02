import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DataApi } from '../../providers/data-api';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class Map {
  lat: any;
  lng: any;
  public nativeDevice: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public dataApi: DataApi
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Map');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginPage');
    this.lat = this.navParams.get("lat");
    this.lng = this.navParams.get("lng");

    if (!this.dataApi.get('debug')) {
      this.dataApi.clear('token');
      this.dataApi.clear('user_id');
    }
  }

}
