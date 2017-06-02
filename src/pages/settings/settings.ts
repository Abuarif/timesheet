import { Component } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Login } from '../login/login';
import { SignUp } from '../sign-up/sign-up';
// import { HomePage } from '../home/home';
import { DataApi } from '../../providers/data-api';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings {
  private serverPath: string = 'https://time.asticus.com.my';
  private token: string = '';
  private email: string = '';
  private user_id: string = '';
  private name: string = '';
  private debug: boolean = false;
  private activate: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public dataApi: DataApi, private nav: Nav) {
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave Settings');
    this.dataApi.update('serverPath', this.serverPath);
    this.dataApi.update('token', this.token);
    this.dataApi.update('debug', this.debug);
    this.dataApi.update('activate', this.activate);
    this.dataApi.update('name', this.name);
  }

  public debugDefault() {
    if (this.debug) {
      this.name = 'Suhaimi Maidin';
      this.dataApi.update('name', this.name);
      this.token = '10010060';
      this.dataApi.update('token', this.token);
      this.dataApi.update('email', this.email);
      this.user_id = '24';
      this.dataApi.update('user_id', this.user_id);
    }
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter Settings');
    if (this.serverPath == '') {
      this.serverPath = this.dataApi.get('serverPath');
    }
    this.user_id = this.dataApi.get('user_id');
    this.token = this.dataApi.get('token');
    this.activate = (this.dataApi.get('activate') == 'true');
    this.name = this.dataApi.get('name');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: 'Please specify your host server in Settings!',
      buttons: ['OK']
    });
    alert.present();
  }

  logout() {
    this.dataApi.flush();
    this.activate = false;
    this.token = '';
    this.user_id = '';
    this.name = '';
    
  }

  login() {
    if (this.activate && (!this.dataApi.get('token'))) {
      console.log('activate');
      this.push();
    } else if (!this.activate) {
      console.log('reactivate');
      this.dataApi.flush();
      this.push();
    }
  }

  push() {
    this.navCtrl.push(Login, {
      serverPath: this.serverPath
    });
  }

  signup() {
    this.navCtrl.push(SignUp, {
      serverPath: this.serverPath,
      name: this.name,
      email: this.email,
      token: this.token
    });
  }
}
