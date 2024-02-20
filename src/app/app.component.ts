import { Component } from '@angular/core';
import { AlertController, Events, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from "../providers/rest/rest";
import { TranslateService } from '@ngx-translate/core';
import { LocalNotifications } from '@ionic-native/local-notifications';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from "@ionic-native/background-geolocation";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { SliderPage } from "../pages/slider/slider";
import { NetworkProvider } from "../providers/network/network";
import { Network } from "@ionic-native/network";
import { App } from "ionic-angular";
import { environment } from '../environment/environment';
// import { HomePage } from "../pages/home/home";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = SliderPage;

  interval: any;

  background_enabled: boolean = false;
  user: any;

  constructor(public platform: Platform, public http: HttpClient, public statusBar: StatusBar,
    public splashScreen: SplashScreen, public rest: RestProvider, public app: App,
    private backgroundGeolocation: BackgroundGeolocation, public eventCtrl: Events,
    public toastController: ToastController, public networkProvider: NetworkProvider, public network: Network,
    public alertCtr: AlertController, private translateService: TranslateService,
    public localNotifications: LocalNotifications) {

    this.splashScreen.show();
    this.initializeApp();
    this.scheduleNotifications();
    // this.listenForMessages();
  }
  scheduleNotifications() {
    this.platform.ready().then(() => {
      if (typeof LocalNotifications !== 'undefined' && this.localNotifications.hasPermission()) {
        // var date = new Date();
        console.log("notification");
        // this.localNotifications.schedule({
        //   text: 'Delayed ILocalNotification',
        //   led: 'FF0000',
        //   foreground: true,
        //   title: "New Message"
        // });
      } else {
        console.log("notification1");
        // Handle cases where LocalNotifications is not available or permission is not granted
        this.localNotifications.requestPermission().then(
          (permission) => {
            if (permission === true) {
              this.localNotifications.schedule({
                text: 'Delayed ILocalNotification',
                led: 'FF0000',
                foreground: true
              });
              console.log('Notification permission granted');
              // You can now schedule and show local notifications
            } else {
              console.warn('Notification permission denied');
            }
          },
          (error) => {
            console.error('Error requesting notification permission:', error);
          }
        );
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // window.addEventListener('beforeunload', () => {
      //   this.rest.setUserStatus(false);
      // });

      this.translateService.setDefaultLang('es');
      this.translateService.use('es');

      this.statusBar.styleDefault();
      //Para ajustar barra de iOS - opcion 2
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();

      this.networkProvider.initializeNetworkEvents();

      if (this.network.type == 'none') {
        this.rest.wifi_enabled = false;

        if (!this.rest.connection_was_checked) {
          this.rest.connection_was_checked = true;
          this.rest.setConnectionChecked(true);
        }
        this.buildAlert();
      }

      this.rest.user$.subscribe(data => {
        this.user = data;
      });

      // Offline event
      this.eventCtrl.subscribe('network:offline', () => {
        //alert('network:offline ==> '+this.network.type);
        this.rest.wifi_enabled = false;

        if (!this.rest.connection_was_checked) {
          this.rest.connection_was_checked = true;
          this.rest.setConnectionChecked(true);
        }
        this.buildAlert();
      });

      // Online event
      this.eventCtrl.subscribe('network:online', () => {
        //alert('network:online ==> '+this.network.type);
        this.rest.wifi_enabled = true;
        if (!this.rest.connection_was_checked) {
          this.rest.connection_was_checked = true;
          this.rest.setConnectionChecked(true);
        }
      });

      //Platform pause & resume
      this.platform.pause.subscribe(() => {
        this.background_enabled = true;
        this.startBackgroundGeolocation();
      });
      this.platform.resume.subscribe(() => {
        if (this.background_enabled) this.stopBackgroundGeolocation();
        this.user.active = false;
        this.rest.updateUser(this.user);
      });
    });


    //Default back button
    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      // Checks if can go back before show up the alert
      if (activeView.name === 'HomePage') {
        const alert = this.alertCtr.create({
          title: 'Cerrar aplicación',
          message: '¿Desea salir de la aplicación?',
          buttons: [{
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              // this.navCtrl.setRoot(HomePage);
            }
          }, {
            text: 'Salir',
            handler: () => {
              this.platform.exitApp();
            }
          }]
        });
        alert.present();
      }
      else if (nav.canGoBack()) {
        nav.pop();
      }
    });
    // this.firebaseMessaging.requestPermission();
  } imhere

  // sayImHere() {
  //   this.interval = setInterval(() => {
  //     if (this.rest.authenticated && this.rest.wifi_enabled && this.rest.call_finished) {
  //       this.rest.imHere();
  //     }
  //   }, 5000);
  // }

  // Background geo

  startBackgroundGeolocation() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 30,
      stationaryRadius: 30,
      distanceFilter: 30,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true, // enable this to clear background location settings when the app terminates
      locationProvider: 1,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      notificationsEnabled: false,
      startForeground: false,
      notificationTitle: 'Geolocalizando',
      //notificationText: 'enabled',
      notificationIconSmall: 'assets/imgs/photo.png',
      notificationIconLarge: 'assets/imgs/photo.png',
      notificationIconColor: '#a82a28',
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          this.setUserPositionBackgroundEnabled(location);
        });
    });
    // start recording location
    this.backgroundGeolocation.start();
  }

  stopBackgroundGeolocation() {
    this.backgroundGeolocation.stop();
  }

  setHeaders() {
    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer' + localStorage.getItem('token'));

    return headers;
  }

  setUserPositionBackgroundEnabled(data) {
    if (this.rest.authenticated) {
      if (this.rest.wifi_enabled) {
        console.log('meh');
        this.http.put(environment.apiUrl + '/auth/update-user-position', {
          'lat': data.latitude,
          'lng': data.longitude
        }, { headers: this.setHeaders(), responseType: 'text' })
          .map(res => res)
          .subscribe(res => {
            this.backgroundGeolocation.finish();
          }, (err) => {
            this.backgroundGeolocation.finish();
          });
      }
    }
  }

  buildAlert() {
    let alert = this.alertCtr.create({
      title: 'Fallo en la conexión',
      message: 'Es necesaria una conexión WiFi o de datos para seguir utilizando la aplicación.',
      buttons: [
        {
          text: 'Reintentar',
          role: 'null',
          handler: () => {
            if (this.rest.wifi_enabled) {
              this.splashScreen.show();
              window.location.reload();
            }
            else {
              this.buildAlert()
            }
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });

    alert.present();
  }

}
