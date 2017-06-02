import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class CheckDevice {
  public nativeDevice: boolean = true;

  constructor(public platform: Platform) {
    console.log('Hello CheckDevice Provider');
    if (this.platform.is('core') || this.platform.is('mobileweb') ) {
      console.log("I'm running on mobile web!");
      this.nativeDevice = false;
    }
  }

}
