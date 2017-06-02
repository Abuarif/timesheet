import { Component } from '@angular/core';

import { Logs } from '../logs/logs';
import { HomePage } from '../home/home';
import { Location } from '../location/location';
import { Settings } from '../settings/settings';
// import { Logout } from '../logout/logout';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = Location;
  tab3Root = Logs;
  tab4Root = Settings;
  // tab5Root = Logout;

  constructor() {

  }

  confirm() {
    alert('logout');
    
  }
}
