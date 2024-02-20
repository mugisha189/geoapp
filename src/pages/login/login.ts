import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {RegisterPage} from "../register/register";
import {Storage} from "@ionic/storage";
import {SliderPage} from "../slider/slider";
import {SynchronicePage} from "../synchronice/synchronice";
import {Network} from "@ionic-native/network";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user = { email: '', password: '' };

  constructor(public rest: RestProvider, public nav: NavController, public navParams: NavParams,
              public forgotCtrl: AlertController, public toastCtrl: ToastController, public storage: Storage,
              public network: Network) {

    if (localStorage.getItem('token')) {
      this.rest.authenticated = true;
      this.rest.setLogued(true);
      this.nav.setRoot(SynchronicePage);
    } else {
      this.rest.connection_checked$.subscribe(data => {
        if (data) this.rest.getCategoriesTags(true);
      });
    }
  }

  login() {
    if (this.user.password != '' && this.user.email != '' && this.validateEmail(this.user.email)) {
      this.rest.loginUser(this.user).then((user) => {
        this.rest.setAuthState(true, user['access_token']);
        this.rest.authenticated = true;
        localStorage.setItem('token', user['access_token']);
        var token = localStorage.getItem('token');
        // var token = this.storage.get('my_token');
        this.rest.setToken(token);
        this.nav.setRoot(SliderPage);
      }).catch(err => {
        console.log(err.message);
      });
    } else {
      let alert = this.forgotCtrl.create({
        title: 'Fallo en el login',
        message: "Usuario y/o contraseña incorrectos",
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  resgister() {
    this.nav.push(RegisterPage);
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: '¿Contraseña olvidada?',
      message: "Introduce tu dirección de email para recuperarla.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            this.rest.resetPassword(data.email);
            console.log('Send clicked');
          }
        }
      ]
    });
    forgot.present();
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
