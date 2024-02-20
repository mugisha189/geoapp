import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { ChatPage } from "../chat/chat";
import { RestProvider } from "../../providers/rest/rest";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { BuddyProfilePage } from "../buddy-profile/buddy-profile";
import { environment } from '../../environment/environment';
import { MapPage } from '../map/map';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  user: any;
  user_list: any;
  buddies: any;
  // last_messages: any;
  notifications: any;
  categories: any;
  blocked_users: any = [];
  fileUrl: string = environment.fileUrl;
  constructor(public nav: NavController, public navParams: NavParams, public rest: RestProvider, public firebase: FirebaseProvider, public toast: ToastController, public platform: Platform) {

    this.platform.registerBackButtonAction(() => {
      this.nav.push(MapPage);
    });

    this.categories = { 'CITAS': 'APPOINTMENTS', 'SITAMARKET': 'SITAMARKET', 'AUTOMOCIÓN': 'AUTOMOTIVE', 'INMUEBLES': 'PROPERTIES', 'ALQUILERES': 'RENTALS', 'RESTAURANTES': 'RESTAURANTS', 'MODOLIBRE': 'FREEMODE', 'NEGOCIOS Y SERVICIOS': 'BUSINESSESANDSERVICES', 'free': 'walk' };

    this.user_list = [];

    this.rest.user$.subscribe(data => {
      this.user = data;
      if (data.blocked_users) {
        this.blocked_users = data.blocked_users.split(',').map(function (item) {
          return parseInt(item, 10);
        });
      }
    });

    this.firebase.getBuddies(this.user, false);

    this.rest.buddies$.subscribe(data => {
      this.buddies = data;
    });

    this.firebase.notifications$.subscribe(data => {
      this.notifications = [];
      for (var i = 0; i < data.length; i++) {
        this.notifications.push(data[i]['user_chat_id']);
      }
    });

    // this.firebase.getLastMessage(this.user, this.user_list);

    // this.firebase.last_messages$.subscribe(data => {
    //   this.last_messages = data;
    // });
  }

  checkNewMessage(buddie_id) {
    return !!this.notifications.includes(buddie_id);
  }

  goChat(buddie) {
    this.rest.setUserChat(buddie);
    this.nav.push(ChatPage, {}, { animate: true, animation: 'transition', duration: 400, direction: 'forward' });
  }

  goProfile(buddie) {
    this.rest.setUserChat(buddie);
    this.nav.push(BuddyProfilePage, {}, { animate: true, animation: 'transition', duration: 400, direction: 'forward' });
  }

  deleteChat(buddie) {
    this.firebase.deleteChat(this.user, buddie);
    this.firebase.getBuddies(this.user);
  }

  blockUser(buddie, block = false) {
    let text = "";
    if (!block) {
      text = 'desbloqueado';
      this.removeItemFromArr(this.blocked_users, buddie.id);
    } else {
      text = 'bloqueado';
      this.blocked_users.push(buddie.id);
    }

    this.user.blocked_users = this.blocked_users.toString();
    this.rest.updateUser(this.user);

    const toast = this.toast.create({
      position: 'top',
      message: 'Se ha ' + text + ' al usuario ' + buddie.name,
      duration: 2000
    });
    toast.present();
  }

  removeItemFromArr(arr, item) {
    var i = arr.indexOf(item);
    console.log(i);
    arr.splice(i, 1);
  }

  alert() {
    const toast = this.toast.create({
      position: 'top',
      message: 'Usuario bloqueado',
      duration: 2000
    });
    toast.present();
  }

  checkImBlocked(user) {
    if (user.blocked_users) {
      var blocks = user.blocked_users.split(',').map(function (item) {
        return parseInt(item, 10);
      });
      return !!blocks.includes(this.user.id);
    }
  }

}
