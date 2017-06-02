import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Api } from "../../providers/api";
import { DataApi } from "../../providers/data-api";

import { Map } from '../map/map';
import { Settings } from '../settings/settings';

@IonicPage()
@Component({
  selector: 'page-logs',
  templateUrl: 'logs.html',
})
export class Logs {
  public logs: any;
  public token: string;
  public limit: number = 5;
  public user_id: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public dataApi: DataApi,
    public _loadingController: LoadingController) {
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter Logs');
    if (!this.dataApi.get('debug')) {
      this.dataApi.clear('token');
      this.dataApi.clear('user_id');
    }

    this.token = this.dataApi.get('token');
    this.user_id = this.dataApi.get('user_id');
    this.getHistory();

    this.login();
  }

  private getHistory() {
    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    //Submit Barcode
    this.api.get_submission_history(this.limit)
      .then((result) => {
        loading.dismiss();
        this.logs = result;
      }, (err) => {
        loading.dismiss();
        // Display submit barcode error code
        alert(err);
      });
  }

  changeLimit() {
    this.getHistory();
  }

  getDetails(lat, lng) {
    this.navCtrl.push(Map, {lat:lat, lng:lng});
  }

  login() {
    if (!this.dataApi.get('token')) {
      this.navCtrl.push(Settings);
    }
  }
}
