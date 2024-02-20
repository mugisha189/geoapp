import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Network } from "@ionic-native/network";
import { Keyboard } from "@ionic-native/keyboard";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { LocationAccuracy } from "@ionic-native/location-accuracy";

//Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from '../environment/environment';
import { AngularFireFunctionsModule } from "@angular/fire/functions";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireMessagingModule } from "@angular/fire/messaging";

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { LoginPage } from "../pages/login/login";
import { MapPage } from "../pages/map/map";
import { ChatsPage } from "../pages/chats/chats";
import { ProfilePage } from "../pages/profile/profile";
import { BuddyProfilePage } from "../pages/buddy-profile/buddy-profile";

import { RestProvider } from '../providers/rest/rest';
import { InterceptorProvider } from '../providers/interceptor/interceptor';
import { RegisterPage } from "../pages/register/register";
import { ChatPage } from "../pages/chat/chat";
import { Geolocation } from "@ionic-native/geolocation";
import { FirebaseProvider } from '../providers/firebase/firebase';
import { NavbarComponent } from "../components/navbar/navbar";
import { CabeceraComponent } from "../components/cabecera/cabecera";
import { SliderPage } from "../pages/slider/slider";
import { AddMarkerPage } from "../pages/add-marker/add-marker";
import { FiltersPage } from "../pages/filters/filters";
import { TagsPage } from "../pages/tags/tags";
import { AlertsPage } from "../pages/alerts/alerts"

import { Camera } from "@ionic-native/camera";
import { SynchronicePage } from "../pages/synchronice/synchronice";

import { BackgroundGeolocation } from "@ionic-native/background-geolocation";
import { NetworkProvider } from "../providers/network/network";
import { MarkersPage } from "../pages/markers/markers";
import { UpdateMarkerPage } from "../pages/update-marker/update-marker";
import { MarkerInfoPage } from "../pages/marker-info/marker-info";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LocalNotifications } from '@ionic-native/local-notifications';


export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    MapPage,
    ChatsPage,
    ProfilePage,
    RegisterPage,
    ChatPage,
    NavbarComponent,
    CabeceraComponent,
    BuddyProfilePage,
    SliderPage,
    SynchronicePage,
    AddMarkerPage,
    FiltersPage,
    MarkersPage,
    UpdateMarkerPage,
    MarkerInfoPage,
    TagsPage,
    AlertsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      backButtonText: ''
    }),
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: 'glosita_app',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // ServiceWorkerModule.register('firebase-messaging-sw.js')
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    MapPage,
    ChatsPage,
    ProfilePage,
    RegisterPage,
    ChatPage,
    NavbarComponent,
    CabeceraComponent,
    BuddyProfilePage,
    SliderPage,
    SynchronicePage,
    AddMarkerPage,
    FiltersPage,
    MarkersPage,
    UpdateMarkerPage,
    MarkerInfoPage,
    TagsPage,
    AlertsPage
  ],
  exports: [
    CabeceraComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    RestProvider,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true },
    RestProvider,
    Geolocation,
    FirebaseProvider,
    Camera,
    Diagnostic,
    Network,
    Keyboard,
    AndroidPermissions,
    LocationAccuracy,
    BackgroundGeolocation,
    NetworkProvider,
    LocalNotifications
  ]
})
export class AppModule {
}
