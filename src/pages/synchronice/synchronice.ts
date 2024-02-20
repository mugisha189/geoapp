import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, Platform, ToastController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Geolocation } from "@ionic-native/geolocation";
import { Diagnostic } from "@ionic-native/diagnostic";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { LocationAccuracy } from "@ionic-native/location-accuracy";
import { HomePage } from "../home/home";

/**
 * Generated class for the SynchronicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-synchronice',
  templateUrl: 'synchronice.html',
})
export class SynchronicePage {

  lat: any;
  lng: any;


  synchronize_complete: any = false;

  constructor(public navCtrl: NavController, public rest: RestProvider, private geolocation: Geolocation,
    private diagnostic: Diagnostic, public alertCtr: AlertController, public platform: Platform,
    public toast: ToastController, public androidPermissions: AndroidPermissions, public locationAccuracy: LocationAccuracy) {
      let synchro = this;
    this.platform.ready().then(() => {
      synchro.getDatas();

      synchro.rest.synchronize$.subscribe(data => {
        if (data) {
          synchro.synchronize_complete = true;
          synchro.navCtrl.setRoot(HomePage);
        }
      });
    })



    // if (!data && this.rest.authenticated) {
    //   console.log(':)');
    //   this.synchronize();
    // }
    // else if (data && this.rest.authenticated) {
    //   console.log('=)');
    //   this.synchronize_complete = true;
    //   this.navCtrl.setRoot(HomePage);
    // }

  }

  getDatas() {
    this.rest.connection_checked$.subscribe(data => {

      //Para testear la app en el webview, descomentar la de abajo y comentar la de arriba
      console.log(this.rest.testApp + "aaa");
      if (this.rest.testApp) { if (data) this.synchronize(); }
      else this.checkGPSPermission();

      // if (data) this.synchronize();

    });
  }

  synchronize() {
    this.rest.getMarkers();
    this.rest.getAlerts();
    this.geolocation.getCurrentPosition().then((resp) => {

      this.rest.lat = resp.coords.latitude;
      this.rest.lng = resp.coords.longitude;

      this.rest.getCategoriesTags(false);

    }).catch((error) => {
      console.log(error);
    });
  }

  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {

        if (result.hasPermission) {
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        console.log("location error");
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.synchronize();
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

}
