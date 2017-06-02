import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnnouncementDetail } from '../announcement-detail/announcement-detail';


@IonicPage()
@Component({
  selector: 'page-announcement',
  templateUrl: 'announcement.html',
})
export class Announcement {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Announcement');
  }

  getDetail() {
    this.navCtrl.push(AnnouncementDetail);
  }
}
