import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from "ionic-angular";
import { HomePage } from "../../pages/home/home";
import { MapPage } from "../../pages/map/map";
import { ChatsPage } from "../../pages/chats/chats";
import { RestProvider } from "../../providers/rest/rest";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { FiltersPage } from "../../pages/filters/filters";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ChatPage } from "../../pages/chat/chat";
@Component({
  selector: 'cabecera',
  templateUrl: 'cabecera.html'
})
export class CabeceraComponent {

  text: string;
  home: string;
  menu: string;
  notifications: any;
  notifications_num: number;
  user: any;

  constructor(public navCtrl: NavController, public rest: RestProvider, public firebase: FirebaseProvider, public toast: ToastController, public localNotifications: LocalNotifications, public platform: Platform) {
    this.rest.user$.subscribe(data => {
      this.user = data;
    });
    this.rest.user_chat$.subscribe(data => {
      console.log(data);
      // this.navCtrl.push(ChatPage);
    });
    try {
      this.localNotifications.on('click').subscribe((notification) => {
        // console.log("click notification");
        // console.log(notification);

        this.rest.getChatUser(notification.data.id);
        console.log('Notification clicked:', notification.data.notifyId);
        this.localNotifications.cancel(notification.data.notifyId).then(() => {
          console.log("Notification Cancelled");
        });
        this.rest.user_chat$.subscribe(data => {
          if (data != "") {
            this.navCtrl.push(ChatPage);
          }
        });

      },
        error => {
          // Handle errors or exceptions
          console.error('Error handling notification click:', error);
        });
    } catch (e) {
      console.log(e);
    }
    this.rest.main_menu$.subscribe(data => {
      this.menu = data;
    });
    this.firebase.notifications$.subscribe(async data => {
      this.notifications = [];
      for (var i = 0; i < data.length; i++) {
        //if (data[i]['user_id'] == this.user.email && data[i]['read'] == false) {
        this.notifications.push(data[i]);
        console.log(data[i]);
        // this.platform.ready().then(() => {
        if (typeof LocalNotifications !== 'undefined' && this.localNotifications.hasPermission()) {
          // var date = new Date();
          console.log("notification");
          console.log(data[i]);
          const isPresented = await this.localNotifications.isPresent(data[i].timestamp);
          const isScheduled = await this.localNotifications.isScheduled(data[i].timestamp);
          if (isPresented || isScheduled) {
            console.log(isPresented);
            console.log(isScheduled);
            continue;
          }
          console.log("schedule");
          this.localNotifications.schedule({
            id: data[i].timestamp,
            text: data[i].message,
            led: 'FF0000',
            title: "Nuevo mensaje",
            foreground: false,
            data: {
              id: data[i].user_chat_id,
              notifyId: data[i].timestamp
            },
            autoClear: false
          });
        } else {
          console.log("notification1");
        }
        // });
        //}
      }
      this.notifications_num = this.notifications.length;
    });
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  goMap() {
    this.navCtrl.setRoot(MapPage);
    this.rest.setMainButton('map');
  }

  goChats() {
    this.navCtrl.setRoot(ChatsPage);
    this.rest.setMainButton('chat');
  }

  goFilters() {
    this.navCtrl.setRoot(FiltersPage);
    this.rest.setMainButton('filters');
  }

  comingSoon() {
    const toast = this.toast.create({
      position: 'top',
      message: 'Sección en construcción',
      duration: 2000
    });
    toast.present();
  }

}
