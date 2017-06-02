import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from "../../providers/api";
import { DataApi } from "../../providers/data-api";

import { Settings } from '../settings/settings';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  private serverPath: string = 'https://time.asticus.com.my';

  public newUser = {
    serverPath: '',
    email: '',
    password: ''
  };

  public loginFormControl: FormGroup;
  private data: any;

  constructor(
    private _nav: NavController,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private _loadingController: LoadingController,
    private _formBuilder: FormBuilder,
    private _api: Api,
    private dataApi: DataApi) {
    // Create FormControl to validate fields
    this.loginFormControl = new FormGroup({
      name: new FormControl(this.dataApi.get('name'), [Validators.required, Validators.email]),
      staffNumber: new FormControl(this.dataApi.get('token'), [Validators.required, Validators.email]),
      email: new FormControl(this.dataApi.get('email'), [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginPage');
    this.dataApi.update('serverPath', this.serverPath);

    if (!this.dataApi.get('debug')) {
      this.dataApi.clear('token');
      this.dataApi.clear('user_id');
    }
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave LoginPage');
    if (!this.data) {
      this.showAlert('Cancelled Sign In.'); 
    } else {
      this.dataApi.update('token', this.data.key);
      this.dataApi.update('user_id', this.data.user_id);
      this.dataApi.update('activate', this.data.isActivated);
      this._nav.push(Settings);
    }
  }

  public login() {

    // Validation
    if (!this.loginFormControl.controls.email.valid) {
      alert("Invalid username! Use full email address as username.");
      return;
    }

    if (!this.loginFormControl.controls.password.valid) {
      alert("Invalid password! Minimum 8 characters.");
      return;
    }

    let loading = this._loadingController.create({
      content: "Please wait...",
      duration: 3000
    });

    loading.present();

    //Take the values from  the form control
    this.newUser.serverPath = this.dataApi.get('serverPath');
    this.newUser.email = this.loginFormControl.get("email").value.trim();
    this.newUser.password = this.loginFormControl.get("password").value;

    console.log(JSON.stringify(this.newUser));

    //Sign in
    this._api.signin(this.newUser.email, this.newUser.password).then((result) => {
      loading.dismiss();
      this.data = result;
      console.log(this.data);
      // Save token and server path to localStorage
      this.dataApi.update('name', this.data.name);
      this.dataApi.update('token', this.data.key);
      this.dataApi.update('user_id', this.data.user_id);
      this.dataApi.update('activate', this.data.isActivated);
      // Close login page after successful signin
      this._nav.pop();
    }, (err) => {
      loading.dismiss();
      // Display signin error code
      alert(err);
    });
  }

  showAlert(message: string) {
    let confirm = this.alertCtrl.create({
      title: 'Alert!',
      message: message,
      buttons: [
        {
          text: 'ok',
          handler: () => {
            console.log('ok clicked');
          }
        },
        
      ]
    });
    confirm.present();
  }

}
