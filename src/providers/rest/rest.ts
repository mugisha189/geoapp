import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/operator/map';

import { Storage } from '@ionic/storage';
import { _throw } from "rxjs/observable/throw";
import { AlertController, LoadingController, Platform, ToastController } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";

import { Network } from "@ionic-native/network";

import {
  BackgroundGeolocation
} from "@ionic-native/background-geolocation";

import { environment } from '../../environment/environment';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  //Poner en true para test
  testApp: boolean = true;

  authenticated = false;
  message = '';

  lat: any;
  lng: any;

  load: any;

  wifi_enabled: boolean = this.testApp;

  platform: any;

  first_interval: boolean = true;
  interval: any;

  position_lat: any;
  position_lng: any;

  public categories = [];

  connection_was_checked: boolean = this.testApp;

  private logued = new BehaviorSubject<boolean>(false);
  public logued$ = this.logued.asObservable();

  private connection_checked = new BehaviorSubject<boolean>(this.testApp);
  public connection_checked$ = this.connection_checked.asObservable();

  private token = new BehaviorSubject<any>('');
  public token$ = this.token.asObservable();

  private user = new BehaviorSubject<any>('');
  public user$ = this.user.asObservable();

  user_id: any;
  user_category_id: any;

  private active_users = new BehaviorSubject<any>('');
  public active_users$ = this.active_users.asObservable();

  private user_chat = new BehaviorSubject<any>('');
  public user_chat$ = this.user_chat.asObservable();

  private main_menu = new BehaviorSubject<any>('');
  public main_menu$ = this.main_menu.asObservable();

  private markers = new BehaviorSubject<any>([]);
  public markers$ = this.markers.asObservable();

  private synchronize = new BehaviorSubject<boolean>(false);
  public synchronize$ = this.synchronize.asObservable();

  private category_selected = new BehaviorSubject<any>({ name: 'free' });
  public category_selected$ = this.category_selected.asObservable();

  private filters = new BehaviorSubject<any>('');
  public filters$ = this.filters.asObservable();

  private alerts = new BehaviorSubject<any>('');
  public alerts$ = this.alerts.asObservable();

  public searchBy = new BehaviorSubject<any>('');
  public searchBy$ = this.searchBy.asObservable();

  public zoom = new BehaviorSubject<any>(14);
  public zoom$ = this.zoom.asObservable();

  public center = new BehaviorSubject<any>('');
  public center$ = this.center.asObservable();

  public selected_filters = new BehaviorSubject<any>('');
  public selected_filters$ = this.selected_filters.asObservable();

  synchronize_complete = false;

  call_finished = true;


  setToken(value): void {
    this.token.next(value);
  }

  setUser(value): void {
    this.user.next(value);
    this.user_id = value.id;
  }

  setLogued(value): void {
    this.logued.next(value);
  }

  setActiveUsers(value): void {
    // console.log('set active users 4');
    this.call_finished = true;
    this.active_users.next(value);
  }

  setSynchronizeStatus(value): void {
    // console.log('set active users 4');
    this.synchronize.next(value);
  }

  setMarkers(value): void {
    this.markers.next(value);
  }

  setUserChat(value): void {
    this.user_chat.next(value);
  }

  setConnectionChecked(value): void {
    this.connection_checked.next(value);
  }

  setMainButton(value): void {
    this.main_menu.next(value);
  }

  setCategory(value): void {
    this.category_selected.next(value);
  }

  setFilters(value): void {
    this.filters.next(value);
  }

  setSelectedFilters(value): void {
    this.selected_filters.next(value);
  }

  setAlerts(value): void {
    this.alerts.next(value);
  }

  setSearch(value): void {
    this.searchBy.next(value);
  }

  setZoom(value): void {
    this.zoom.next(value);
  }

  setCenter(value): void {
    this.center.next(value);
  }


  //Observable Buddies
  private buddies = new BehaviorSubject<any>(0);
  public buddies$ = this.buddies.asObservable();

  setBuddies(value): void {
    this.buddies.next(value);
  }

  constructor(public loadingCtrl: LoadingController, platform: Platform, public alertCtr: AlertController, public http: HttpClient, public storage: Storage, public alertCtrl: AlertController, public toastController: ToastController, private geolocation: Geolocation, private network: Network, private backgroundGeolocation: BackgroundGeolocation) {
    this.platform = platform;

    this.wifi_enabled = this.testApp;
    this.setConnectionChecked(this.testApp);

    this.network.onConnect().subscribe(() => {
      this.wifi_enabled = true;

      if (!this.connection_was_checked) {
        this.connection_was_checked = true;
        this.setConnectionChecked(true);
      }

    });

    this.network.onDisconnect().subscribe(() => {
      this.wifi_enabled = false;

      if (!this.connection_was_checked) {
        this.connection_was_checked = true;
        this.setConnectionChecked(true);
      }
    });
  }


  // buildAlert(function_name, parameters) {
  //   let alert = this.alertCtr.create({
  //     title: 'Fallo en la conexión',
  //     message: 'Es necesaria una conexión WiFi o de datos',
  //     buttons: [
  //       {
  //         text: 'Reintentar',
  //         role: 'cancel',
  //         handler: () => {
  //           if (function_name == 'getCategoriesTags') this.getCategoriesTags(parameters['login']);
  //           else if (function_name == 'getUser') this.getUser(parameters['profile']);
  //           else if (function_name == 'setUserStatus') this.setUserStatus(parameters['active']);
  //           else if (function_name == 'setUserPosition') this.setUserPosition(parameters['data']);
  //           else if (function_name == 'getActiveUsers') this.getActiveUsers(parameters['category'], parameters['position']);
  //         }
  //       },
  //       {
  //         text: 'Cerrar',
  //         role: 'cancel',
  //         handler: () => {
  //           this.platform.exitApp();
  //         }
  //       }
  //     ]
  //   });
  //
  //   alert.present();
  // }

  setHeaders() {
    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer' + localStorage.getItem('token'));

    return headers;
  }

  setHeaders2() {
    var headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Authorization', 'Bearer' + localStorage.getItem('token'));

    return headers;
  }

  setAuthState(authenticated, token) {
    if (authenticated) {
      this.storage.set('my_token', token).then(() => {
        this.authenticated = true;
      });
    } else {
      this.storage.remove('my_token').then(() => {
        this.authenticated = false;
      });
    }
  }

  resetPassword(email) {
    this.http.post(environment.apiUrl + '/auth/new/password', { 'email': email }, { headers: this.setHeaders() })
      .map(res => res)
      .subscribe(res => {
        const toast = this.toastController.create({
          position: 'top',
          message: 'Correo enviado',
          duration: 2000
        });
        toast.present();
      });
  }

  loginUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiUrl + '/auth/login', data)
        .subscribe(res => {
          this.setLogued(true);
          resolve(res);
          const toast = this.toastController.create({
            position: 'top',
            message: 'Usuario logueado correctamente',
            duration: 2000
          });
          toast.present();
        }, (err) => {
          reject(err);
        });
    });
  }

  logout() {
    return this.http.get(environment.apiUrl + '/auth/logout', { headers: this.setHeaders() }).subscribe(res => {
      let loading = this.loadingCtrl.create({
        content: 'Desconectando...',
        spinner: 'bubbles'
      });
      loading.present();

      this.authenticated = false;
      this.first_interval = true;
      clearInterval(this.interval);
      this.synchronize_complete = false;
      this.setLogued(false);
      this.setSynchronizeStatus(false);
      loading.dismiss();
      // const toast = this.toastController.create({
      //   position: 'top',
      //   message: 'Usuario deslogueado',
      //   duration: 2000
      // });
      // toast.present();
    }, (err) => {
      console.error(err);
    });
  }

  getUser(profile = false) {
    if (this.wifi_enabled) {
      return this.http.get(environment.apiUrl + '/auth/user', { headers: this.setHeaders() }).subscribe(res => {
        this.setUser(res);
        if (!profile) this.setUserPosition({ 'lat': parseFloat(this.lat), 'lng': parseFloat(this.lng) });
      }, (err) => {
        console.error(err);
      });
    } else {
      //this.buildAlert('getUser', {'profile': profile});
    }
  }

  getChatUser(user_chat_id) {
    return this.http.get(environment.apiUrl + "/auth/user/" + user_chat_id, { headers: this.setHeaders() }).subscribe(res => {
      this.setUserChat(res);
    }, (err) => {
      console.error(err);
    });
  }

  // imHere() {
  //   return new Promise((resolve, reject) => {
  //     this.http.put(this.apiUrl + '/auth/update/im/here', true, {headers: this.setHeaders()})
  //       .subscribe(res => {
  //         console.log('enviado imhere');
  //         resolve(res);
  //       }, (err) => {
  //         // console.log(err);
  //       });
  //   });
  // }

  checkAddress(latlng) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiUrl + '/auth/proxy/google-maps?lat=' + latlng.split(",")[0] + '&lng=' + latlng.split(",")[1])
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  createMarker(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiUrl + '/auth/create/marker', data)
        .subscribe(res => {
          this.setMarkers(res['markers']);
          resolve(res);
          let alert = this.alertCtrl.create({
            title: 'Marcador registrado',
            message: 'Marcador creado con éxito. Otros usuarios podrán ponerse en contacto mediante dicho marcador.',
            buttons: ['Ok']
          });
          alert.present();
          this.getActiveUsers('free', false);
        }, (err) => {
          reject(err);
        });
    });
  }

  getMarkers() {
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiUrl + '/auth/markers', { headers: this.setHeaders() })
        .subscribe(res => {
          this.setMarkers(res);
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateMarker(marker) {
    return new Promise((resolve, reject) => {
      this.http.put(environment.apiUrl + '/auth/update/marker/' + marker.id, marker, { headers: this.setHeaders() })
        .subscribe(res => {
          this.setMarkers(res['markers']);
          resolve(res);
          let alert = this.alertCtrl.create({
            title: 'Marcador',
            message: 'Marcador actualizado con éxito',
            buttons: ['Ok']
          });
          alert.present();
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteMarker(marker) {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.apiUrl + '/auth/delete/marker/' + marker, { headers: this.setHeaders() })
        .subscribe(res => {
          this.setMarkers(res);
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  registerUser(data) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiUrl + '/auth/register', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateUser(data, profile = false) {
    this.http.put(environment.apiUrl + '/auth/update-user', data, { headers: this.setHeaders() })
      .map(res => res)
      .subscribe(res => {
        this.setUser(res['user']);
        if (profile) {
          const toast = this.toastController.create({
            position: 'top',
            message: 'El perfil de usuario se ha actualizado correctamente.',
            duration: 20000
          });
          toast.present();
        }
      });

    return 'ok';
  }

  // Geolocalización con el servidor

  getActiveUsers(category, position) {
    if (this.authenticated) {
      if (this.wifi_enabled) {
        return this.http.get(environment.apiUrl + '/auth/users-position', {
          headers: this.setHeaders(),
          params: { category: category }
        }).subscribe(res => {
          // console.log('get active users 3');
          this.setActiveUsers(res);
          if (!this.synchronize_complete) {
            this.setSynchronizeStatus(position);
            this.synchronize_complete = true;
          }
          // this.load.dismiss();
        }, (err) => {
          console.error(err);
        });
      } else {
        //this.buildAlert('getActiveUsers', {'category': category, 'position': position});
      }
    }
  }

  getBuddies(list) {
    if (this.wifi_enabled) {
      return this.http.get(environment.apiUrl + '/auth/buddies', {
        headers: this.setHeaders(),
        params: { buddies: list.toString() }
      }).subscribe(res => {
        this.setBuddies(res);
      }, (err) => {
        console.error(err);
      });
    } else {
      //this.buildAlert('getCategoriesTags', {'login': login});
    }
  }

  updateBuddies(user) {
    this.http.put(environment.apiUrl + '/auth/update-buddie', { 'buddies': user.buddies }, {
      headers: this.setHeaders(),
      responseType: 'text'
    })
      .map(res => res)
      .subscribe(res => {
        console.log(res);
      });
  }


  setUserStatus(active) {
    // if (active) this.load.present();
    if (this.wifi_enabled) {
      this.http.put(environment.apiUrl + '/auth/user-status', { 'active': active }, {
        headers: this.setHeaders(),
        responseType: 'text'
      })
        .map(res => res)
        .subscribe(res => {
        });
    } else {
      //this.buildAlert('setUserStatus', {'active': active});
    }

  }

  setUserPosition(data) {
    if (this.authenticated) {
      if (this.wifi_enabled) {
        this.http.put(environment.apiUrl + '/auth/update-user-position', {
          'lat': data.lat,
          'lng': data.lng
        }, { headers: this.setHeaders(), responseType: 'text' })
          .map(res => res)
          .subscribe(res => {
            // console.log('set user position 2');
            let position;
            this.position_lat = data.lat;
            this.position_lng = data.lng;
            position = !((data.lat == null && data.lng == null) || (data.lat == '' && data.lng == ''));
            this.getActiveUsers('free', position);
            this.getMarkers();
            this.getAlerts();
          });
      } else {
        //this.buildAlert('setUserPosition', {'data': data});
      }
    }
  }

  getCategoriesTags(login = false) {
    if (this.wifi_enabled) {
      return this.http.get(environment.apiUrl + '/auth/categories', { headers: this.setHeaders() }).subscribe(res => {
        for (let data in res) {
          this.categories[res[data].name] = res[data];
        }
        if (!login) this.getUser();
      }, (err) => {
        console.error(err);
      });
    } else {
      //this.buildAlert('getCategoriesTags', {'login': login});
    }
  }

  setPhotoProfile(data) {
    let result: any;

    this.http.post(environment.apiUrl + '/auth/user/avatar', { 'photo': data }, { headers: this.setHeaders2() })
      .map(res => res)
      .subscribe(res => {
        result = data;
      });
  }

  sendAlert(data) {
    let result: any;

    this.http.post(environment.apiUrl + '/auth/create/alert', { 'description': data }, { headers: this.setHeaders2() })
      .map(res => res)
      .subscribe(res => {
        result = data;
      });
  }

  deleteAlert() {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.apiUrl + '/auth/delete/alert', { headers: this.setHeaders() })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateAlert(alert) {
    this.http.put(environment.apiUrl + '/auth/update/alert', { 'id': alert }, {
      headers: this.setHeaders(),
      responseType: 'text'
    })
      .map(res => res)
      .subscribe(res => {
        console.log(res);
      });
  }

  getFilters(data) {
    if (this.wifi_enabled) {
      return this.http.get(environment.apiUrl + '/auth/get/filters/' + data, { headers: this.setHeaders2() })
        .subscribe(res => {
          this.setFilters(res);
        }, (err) => {
          console.error(err);
        });
    } else {
      //this.buildAlert('getCategoriesTags', {'login': login});
    }
  }

  getAlerts() {
    if (this.wifi_enabled) {
      return this.http.get(environment.apiUrl + '/auth/get/alerts', { headers: this.setHeaders2() })
        .subscribe(res => {
          this.setAlerts(res);
        }, (err) => {
          console.error(err);
        });
    } else {
      //this.buildAlert('getCategoriesTags', {'login': login});
    }
  }


}
