import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";

/**
 * Generated class for the AddMarkerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-marker',
  templateUrl: 'add-marker.html',
})
export class AddMarkerPage {

  user: any;

  marker: any = {
    title: '',
    info: '',
    address: '',
    position_lat: '',
    position_lng: '',
    category_id: '',
    tag_id: '',
    user_id: this.rest.user_id
  };
  categories_keys = this.rest.categories;
  categories: any = [];

  tags: any = [];
  filters: any;

  marker_filters: any = [];

  tags_data = true;
  disabledButton = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public alertCtrl: AlertController) {

    this.rest.user$.subscribe(data => {
      this.user = data;
      this.marker.category_id = data.category.id;
    });

    this.rest.getFilters(this.user.category.id);

    this.marker.position_lat = navParams.get('latitude');
    this.marker.position_lng = navParams.get('longitude');

    this.categories = Object.keys(this.categories_keys);

    this.rest.filters$.subscribe(data => {
      this.marker_filters = {};
      this.filters = data;
      for (var i = 0; i < data.length; i++) {
        this.marker_filters[data[i].dataname] = '';
      }
    });

    this.checkAddress();
  }

  checkAddress() {
    var latlng = this.marker.position_lat+','+this.marker.position_lng;
    this.rest.checkAddress(latlng).then((address) => {
      if (address['status'] == "OK") {
        this.marker.address = address['results'][0]['formatted_address'];
      } else {
        let alert = this.alertCtrl.create({
          title: 'Fallo en la dirección',
          message: 'Por favor, vuelva a intentarlo.',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      }
    }).catch(err => {
      console.log(err.message);
    });

  }

  createMarker() {
    this.marker.filters = JSON.stringify(this.marker_filters);

    this.rest.createMarker(this.marker).then((marker) => {
      console.log('Succesful created');
      this.navCtrl.pop();
    }).catch(err => {
      console.log(err.message);
    });
  }

  onChange(e) {
    this.tags = this.categories_keys[e].tags;
    this.marker.tag = null;

    this.tags_data = false;
  }

  showInfo(data) {
    let alert = this.alertCtrl.create({
      title: 'Información sobre campo',
      message: data,
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}
