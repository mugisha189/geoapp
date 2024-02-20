import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

/**
 * Generated class for the UpdateMarkerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-marker',
  templateUrl: 'update-marker.html',
})
export class UpdateMarkerPage {

  marker:any;

  categories_keys = this.rest.categories;
  categories: any = [];

  tags: any = [];
  filters: any;
  filter_keys: any;

  tags_data = true;

  disabledButton = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public alertCtrl: AlertController) {
    this.categories = Object.keys(this.categories_keys);
    this.marker = this.navParams.get('marker');
    if (this.marker.filters) {
      this.filters = JSON.parse(this.marker.filters);
      this.filter_keys = Object.keys(JSON.parse(this.marker.filters));
    }
  }

  checkAddress() {
    this.disabledButton = true;
    let address = this.marker.address.split(',');
    var address_formated = [];

    address.forEach( function(valor, indice, array) {
      let items = valor.split(' ');
      address_formated.push(items.join('+'));
    });

    let new_address = address_formated.join(',');

    if(new_address != '') {
      this.rest.checkAddress(new_address).then((address) => {

        if(address['status'] == "OK")
        {
          this.marker.address = address['results'][0]['formatted_address'];
          this.marker.position_lat = address['results'][0]['geometry']['location']['lat'];
          this.marker.position_lng = address['results'][0]['geometry']['location']['lng'];

          this.updateMarker();
        } else {
          this.disabledButton = false;
          let alert = this.alertCtrl.create({
            title: 'Fallo en la dirección',
            message: 'Por favor, comprueba la dirección introducida.',
            buttons: [
              {
                text: 'Aceptar',
                role: 'cancel'
              }
            ]
          });
          alert.present();
        }
      }).catch(err => {
        this.disabledButton = false;
        console.log(err.message);
      });
    }
  }

  updateMarker()
  {
    this.marker.filters = JSON.stringify(this.filters);
    this.rest.updateMarker(this.marker);
    this.disabledButton = false;
    this.navCtrl.pop();
  }

  onChange(e) {
    this.tags = this.categories_keys[e].tags;
    this.marker.tag = null;

    this.tags_data = false;
  }

}
