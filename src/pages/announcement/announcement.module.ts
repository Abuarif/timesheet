import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Announcement } from './announcement';

@NgModule({
  declarations: [
    Announcement,
  ],
  imports: [
    IonicPageModule.forChild(Announcement),
  ],
  exports: [
    Announcement
  ]
})
export class AnnouncementModule {}
