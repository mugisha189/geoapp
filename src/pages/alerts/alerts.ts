import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { ChatPage } from "../chat/chat";
import { environment } from "../../environment/environment";

declare var google: any;

/**
 * Generated class for the AlertsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alerts',
  templateUrl: 'alerts.html',
})
export class AlertsPage {
  fileUrl: string = environment.fileUrl;
  user: any;
  alerts: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {

    this.rest.alerts$.subscribe(data => {
      this.alerts = data.alerts;
    });

    this.rest.user$.subscribe(data => {
      this.user = data;
    });

  }

  ionViewDidLoad() {
  }

  calcDistance(user1, user2) {
    var p1 = new google.maps.LatLng(user1.position_lat, user1.position_lng);
    var p2 = new google.maps.LatLng(user2.position_lat, user2.position_lng);
    return (Math.round(google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000));
  }

  goChat(buddie, alert) {
    this.rest.setUserChat(buddie);
    this.navCtrl.push(ChatPage, {}, { animate: true, animation: 'transition', duration: 400, direction: 'forward' });
  }

}
