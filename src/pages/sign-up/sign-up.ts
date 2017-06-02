import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from "../../providers/api";
import { DataApi } from "../../providers/data-api";


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUp {

  public newUser = {
    serverPath: '',
    email: '',
    name: '',
    staffNumber: '',
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
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter LoginPage');
    this.dataApi.update('serverPath', this.navParams.get("serverPath"));
    this.dataApi.update('name', this.navParams.get("name"));
    this.dataApi.update('email', this.navParams.get("email"));
    this.dataApi.update('token', this.navParams.get("token"));

    if (!this.dataApi.get('debug')) {
      this.dataApi.clear('token');
      this.dataApi.clear('user_id');
    }
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave LoginPage');
    if (!this.data) {
      this.showAlert('Cancelled Sign Up.');
    } else {
      this.dataApi.update('token', this.data.key);
      this.dataApi.update('user_id', this.data.user_id);
    }
  }

  public signup() {

    // Validation
    if (!this.loginFormControl.controls.email.valid) {
      alert("Invalid username! Use full email address as username.");
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
    this.newUser.name = this.loginFormControl.get("name").value;
    this.newUser.staffNumber = this.loginFormControl.get("staffNumber").value;

    console.log(JSON.stringify(this.newUser));

    //Sign in
    this._api.signup(this.newUser.name, this.newUser.staffNumber, this.newUser.email).then((result) => {
      loading.dismiss();
      this.data = result;
      console.log(this.data);
      if (this.data.result == 0) {
        this.showAlert('You have registered with the system. Proceed to Activate Connection');
      } else {
        this.showAlert('Thank you for registering.');
      }
      // Close login page after successful signup
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
