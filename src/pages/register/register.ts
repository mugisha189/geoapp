import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user: any = { name: '', surname: '', email: '', sex: '', birthdate: '', password: '', phone: '', category: 'transport', tag: 10, description: '' };

  categories_keys = this.rest.categories;
  categories: any = [];

  isenabled: any = true;

  tags: any = [];

  tags_data = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public alertCtrl: AlertController) {
    this.categories = Object.keys(this.categories_keys);
  }

  resgister() {
    if (this.isenabled) {
      this.isenabled = false;
      this.rest.registerUser(this.user).then((user) => {
        console.log('Succesful register');
        let alert = this.alertCtrl.create({
          title: 'Usuario registrado',
          message: 'Se ha enviado un correo de verificación a la cuenta seleccionada, por favor siga las instrucciones que se le indican en el mismo.',
          buttons: ['Ok']
        });
        alert.present();
        this.isenabled = true;
        this.navCtrl.pop();
      }).catch(err => {
        console.log(err.message);
        if (err.error.message != 'Email Exist' && err.error.message != 'El email ya está registrado, por favor, vuelva a intentarlo con otras credenciales.') {
          let alert = this.alertCtrl.create({
            title: 'Error en el registro',
            message: (err.error.message == 'Email Exist' || err.error.message == 'El email ya está registrado, por favor, vuelva a intentarlo con otras credenciales.') ? 'Este email ya está en uso. Por favor, vuelva a intentarlo con otro correo' : 'Se ha producido un error en el registro, por favor vuelva a intentarlo pasados unos minutos.',
            buttons: ['Ok']
          });

          alert.present();
        }
      });
    }

  }

  onChange(e) {
    this.tags = this.categories_keys[e].tags;
    this.tags_data = false;
  }
}
