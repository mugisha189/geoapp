import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {ChatPage} from "../chat/chat";

/**
 * Generated class for the MarkerInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-marker-info',
  templateUrl: 'marker-info.html',
})
export class MarkerInfoPage {

  marker: any;
  user_chat: any;
  filters: any;
  keys: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
    this.marker = this.navParams.get('marker');
    this.rest.user_chat$.subscribe(data => {
      this.user_chat = data;
    });

    this.filters = JSON.parse(this.marker.filters);
    this.keys = Object.keys(this.filters);
  }

  ngOnDestroy() {
    this.rest.setUserChat(null);
  }

  chat() {
    this.navCtrl.push(ChatPage);
  }

  report(){

  }

}
