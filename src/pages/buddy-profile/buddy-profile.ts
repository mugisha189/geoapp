import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { ChatPage } from "../chat/chat";
import { environment } from '../../environment/environment';

@IonicPage()
@Component({
  selector: 'page-buddy-profile',
  templateUrl: 'buddy-profile.html',
})
export class BuddyProfilePage {

  user_chat: any;
  user_photo: any;
  lastPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public toast: ToastController) {

    this.lastPage = this.navCtrl.last().component.name;
    this.rest.user_chat$.subscribe(data => {
      if (data) {
        this.user_chat = data;
        this.user_photo = environment.fileUrl + '/avatars/' + this.user_chat.photo;
      }
    });
  }

  chat() {
    this.navCtrl.push(ChatPage);
  }

  block() {

  }

  report() {

  }

  ngOnDestroy() {
    if (this.lastPage != 'ChatPage') {
      this.rest.setUserChat(null);
    }
  }

  calcularEdad(fecha) {
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    return edad;
  }

  blockUser() {
    const toast = this.toast.create({
      position: 'top',
      message: 'Se ha bloqueado al usuario ' + this.user_chat.name,
      duration: 2000
    });
    toast.present();
  }

  reportUser() {
    const toast = this.toast.create({
      position: 'top',
      message: 'Se ha reportado al usuario ' + this.user_chat.name,
      duration: 2000
    });
    toast.present();
  }


}
