import {AlertController} from 'ionic-angular';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {catchError} from "rxjs/operators";
import {_throw} from "rxjs/observable/throw";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/Rx';


@Injectable()
export class InterceptorProvider implements HttpInterceptor {

  constructor(public storage: Storage, private alertCtrl: AlertController) {
  }

  // Intercepts all HTTP requests!
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let promise = this.storage.get("my_token");

    return Observable.fromPromise(promise)
      .mergeMap(token => {
          let cloneReq = this.addToken(request, token);
          return next.handle(cloneReq).pipe(
            catchError(error => {

                let msg = error.message;
                let title = error.name;
                if (error.error.title && error.error.message) {
                  title = error.error.title;
                  msg = error.error.message;
                }

              if (title != 'HttpErrorResponse') {

                let alert = this.alertCtrl.create({
                  title: title,
                  message: msg,
                  buttons: ['Ok']
                });
                alert.present();

              }

              return _throw(error);
            })
          );
    });
  }

  private addToken(request: HttpRequest<any>, token: any) {
    if (token) {
      let clone: HttpRequest<any>;
      clone = request.clone({
        setHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return clone;
    }

    return request;
  }

}
