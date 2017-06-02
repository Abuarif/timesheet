import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Location } from '../pages/location/location';
import { Logs } from '../pages/logs/logs';
import { Settings } from '../pages/settings/settings';
import { Announcement } from '../pages/announcement/announcement';
import { AnnouncementDetail } from '../pages/announcement-detail/announcement-detail';
import { SignUp } from '../pages/sign-up/sign-up';

import { TabsPage } from '../pages/tabs/tabs';

import { Api } from '../providers/api';
import { DataApi } from '../providers/data-api';
import { LocationTracker } from '../providers/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { DatePipe } from '@angular/common';
import { CheckDevice } from '../providers/check-device';
import { ConnectivityService } from '../providers/connectivity-service';
import { Network } from '@ionic-native/network';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Login,
    SignUp,
    Location,
    Logs,
    Settings,
    Announcement,
    AnnouncementDetail,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Location,
    Login,
    SignUp,
    Logs,
    Settings,
    HomePage,
    Announcement,
    AnnouncementDetail,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocationTracker,
    BackgroundGeolocation,
    Geolocation,
    NativeGeocoder,
    Api,
    DataApi,
    DatePipe,
    CheckDevice,
    Network,
    ConnectivityService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
