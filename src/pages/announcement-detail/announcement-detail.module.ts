import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnouncementDetail } from './announcement-detail';

@NgModule({
  declarations: [
    AnnouncementDetail,
  ],
  imports: [
    IonicPageModule.forChild(AnnouncementDetail),
  ],
  exports: [
    AnnouncementDetail
  ]
})
export class AnnouncementDetailModule {}
