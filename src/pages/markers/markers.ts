import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {UpdateMarkerPage} from "../update-marker/update-marker";

/**
 * Generated class for the MarkersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-markers',
  templateUrl: 'markers.html',
})
export class MarkersPage {

  markers:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public alertCtrl: AlertController) {
    this.rest.markers$.subscribe(data => {
      this.markers = data;
    });
  }

  updateMarker(marker)
  {
    this.navCtrl.push(UpdateMarkerPage, {'marker':marker});
  }

  deleteMarker(marker) {
    let alert = this.alertCtrl.create({
      title: 'Borrar Marcador',
      message: '¿Realmente desea eliminar este marcador?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            console.log('Buy clicked');
            this.rest.deleteMarker(marker.id);
          }
        }
      ]
    });
    alert.present();
  }

}
