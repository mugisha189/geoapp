import { Component, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  Content,
  NavController,
  NavParams,
  PopoverController,
  ToastController
} from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { Keyboard } from "@ionic-native/keyboard";
import { BuddyProfilePage } from "../buddy-profile/buddy-profile";
import { ChatsPage } from "../chats/chats";
import { environment } from '../../environment/environment';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;
  @ViewChild('sendMessage') myInput;

  fileUrl: string = environment.fileUrl;
  user: any;
  user_chat: any;
  messages: any;
  message: string = '';
  notifications: any;
  lastPage: string = '';
  first_time: boolean = true;
  categories: any;
  blocked_users: any;
  blocked_users_buddie: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider,
    public firebase: FirebaseProvider, public keyboard: Keyboard, public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController, public toast: ToastController, public nav: NavController) {

    this.categories = { 'CITAS': 'APPOINTMENTS', 'SITAMARKET': 'SITAMARKET', 'AUTOMOCIÓN': 'AUTOMOTIVE', 'INMUEBLES': 'PROPERTIES', 'ALQUILERES': 'RENTALS', 'RESTAURANTES': 'RESTAURANTS', 'MODOLIBRE': 'FREEMODE', 'NEGOCIOS Y SERVICIOS': 'BUSINESSESANDSERVICES', 'free': 'walk' };

    this.lastPage = this.navCtrl.last().component.name;

    this.rest.user$.subscribe(data => {
      this.user = data;
      if (data && data.blocked_users && data.blocked_users != null) {
        this.blocked_users = data.blocked_users.split(',').map(function (item) {
          return parseInt(item, 10);
        });
      } else {
        this.blocked_users = [];
      }
    });

    this.rest.user_chat$.subscribe(data => {
      this.user_chat = data;
      if (data && data.blocked_users) {
        this.blocked_users_buddie = data.blocked_users.split(',').map(function (item) {
          return parseInt(item, 10);
        });
      } else {
        this.blocked_users_buddie = [];
      }
    });

    this.firebase.notifications$.subscribe(data => {
      this.notifications = data;
      for (var i = 0; i < data.length; i++) {
        if (this.user_chat != null && data[i]['user_chat_id'] == this.user_chat.id) {
          this.firebase.deleteNotification(this.user, this.user_chat);
        }
      }
    });

    this.firebase.getMessages(this.user, this.user_chat).subscribe(data => {
      this.messages = data;
    });

  }

  newMessage(event) {

    var date = this.getTimeMessage();


    let send_message = {
      "send": true,
      "user_id": this.user_chat.id,
      "timestamp": date,
      "message": this.message,
      "read": false
    };

    let received_message = {
      "send": false,
      "user_id": this.user.id,
      "timestamp": date,
      "message": this.message,
      "read": false
    };

    let notification = {
      "message": this.message,
      "read": false,
      "user_id": this.user_chat.id,
      "user_chat_id": this.user.id,
      "timestamp": date
    };
    if (this.message != '') {
      this.firebase.newMessage(this.user, send_message, this.user_chat);

      // Si el usuario con quien chateas NO te tiene bloqueado
      if (!this.blocked_users_buddie.includes(this.user.id)) {
        console.log('te tiene bloqueado');
        this.firebase.newMessage(this.user_chat, received_message, this.user);
        this.firebase.newNotification(this.user, notification, this.user_chat);
        this.firebase.timeBuddies(this.user, this.user_chat, date, true);
      } else {
        this.firebase.timeBuddies(this.user, this.user_chat, date);
      }

      this.scrollto();
    }
    this.message = "";
    this.keyboard.show();
    this.myInput.setFocus();
  }

  scrollto() {
    setTimeout(() => {
      if (this.content) this.content.scrollToBottom();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.lastPage != 'BuddyProfilePage' && this.lastPage != 'MarkerInfoPage' && this.lastPage != 'ChatPage') {
      this.rest.setUserChat(null);
    } else {
      console.log('Saliendo de chat');
    }
  }

  getTimeMessage() {
    var date = new Date();

    var yyyy = date.getFullYear();
    var mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); // getMonth() is zero-based
    var dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var ms = ChatPage.addZero(date.getMilliseconds(), 3);

    if (ms < 10) ms = "0" + ms;

    return "".concat(String(yyyy)).concat(String(mm)).concat(String(dd)).concat(String(hh)).concat(String(min)).concat(String(ss)).concat(String(ms));
  };

  static addZero(x, n) {
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  formatTime(date) {

    var hour = date.substring(8, 10);
    var minute = date.substring(10, 12);

    var time = hour + ':' + minute;
    return time;
  }

  compareDates(date) {
    var todayDate = new Date().toISOString().slice(0, 10);
    var fecha = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);

    if (todayDate == fecha) return 'HOY';
    else return fecha;
  }

  callLastItem(last) {
    if (last && this.first_time) {
      this.content.scrollToBottom(0);
      setTimeout(() => {
        this.first_time = false
      }, 1000);
    }
  }

  presentPopover(ev: any) {
    // let popover = this.popoverCtrl.create(BlockUserComponent);
    // popover.present();
    this.sheetBlock();
  }

  sheetBlock() {

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Acciones',
      buttons: [
        {
          text: 'Reportar usuario',
          icon: 'information-circle',
          role: 'destructive',
          handler: () => {
            const toast = this.toast.create({
              position: 'top',
              message: 'Se ha reportado al usuario ' + this.user_chat.name,
              duration: 2000
            });
            toast.present();
          }
        }, {
          text: 'Bloquear usuario',
          icon: 'lock',
          handler: () => {

            // this.firebase.blockUser(this.user, this.user_chat, true);
            this.blocked_users.push(this.user_chat.id);
            this.user.blocked_users = this.blocked_users.toString();
            this.rest.updateUser(this.user);

            const toast = this.toast.create({
              position: 'top',
              message: 'Se ha bloqueado al usuario ' + this.user_chat.name,
              duration: 2000
            });
            toast.present();

            this.navCtrl.setRoot(ChatsPage);
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  goProfile(buddie) {
    this.rest.setUserChat(buddie);
    this.nav.push(BuddyProfilePage, {}, { animate: true, animation: 'transition', duration: 400, direction: 'forward' });
  }

}
