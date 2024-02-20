import { Component } from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import {MapPage} from "../map/map";
import {ProfilePage} from "../profile/profile";
import {RestProvider} from "../../providers/rest/rest";
import {Geolocation} from "@ionic-native/geolocation";

import { Diagnostic } from '@ionic-native/diagnostic';
import {MarkersPage} from "../markers/markers";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lat: any;
  lng: any;

  platform: any;

  wifi_enabled:boolean;

  constructor(public navCtrl: NavController, public rest: RestProvider, private geolocation: Geolocation,
              private diagnostic: Diagnostic, platform: Platform,
              public toast: ToastController) {
    this.platform = platform;

    this.rest.setMainButton('map');
    this.rest.setUserStatus(true);
  }


  connect() {
    this.navCtrl.setRoot(MapPage);
  }

  showProfle() {
    this.navCtrl.push(ProfilePage);
  }

  markers() {
    this.navCtrl.push(MarkersPage);
  }

}
