import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Logs } from './logs';

@NgModule({
  declarations: [
    Logs,
  ],
  imports: [
    IonicPageModule.forChild(Logs),
  ],
  exports: [
    Logs
  ]
})
export class LogsModule {}
