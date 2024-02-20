import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {HomePage} from "../../pages/home/home";
import {MapPage} from "../../pages/map/map";
import {ChatsPage} from "../../pages/chats/chats";

/**
 * Generated class for the NavbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {

  text: string;

  constructor(public navCtrl: NavController) {

  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  goMap() {
    this.navCtrl.setRoot(MapPage);
  }

  goChats() {
    this.navCtrl.setRoot(ChatsPage);
  }

}
