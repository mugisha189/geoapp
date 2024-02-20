import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the SliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slider',
  templateUrl: 'slider.html',
})
export class SliderPage {
  @ViewChild('mySlides') mySlides: Slides;

  slides = [
    {
      title: "GEOLOCALIZACION",
      description: 'Activa el GPS en tu terminal para mejorar la experiencia de usuario. Permite a GLOSITA acceder a tu ubicacion para mayor exactitud de la gestion de usuarios.',
      image: "assets/imgs/slide2.png",
    },
    {
      title: "SITACHAT",
      description: 'Chatea e interactua en tiempo real en el mapa. Gestiona tu sitachat segun usuario y categoria.',
      image: "assets/imgs/slide3.png",
    },
    {
      title: "MARCADORES DE ENTORNO",
      description: 'Podrás situar un pin en el mapa en el que podrás dejar tu objetivo fijado para que otros usuarios te vean de forma permanente.',
      image: "assets/imgs/slide4.png",
    },
    {
      title: "SITACAR",
      description: 'Establece una interconexión en tiempo real con la comunidad añadiendo tu vehículo, con la que podrás programar tus viajes, compartirlos, ademas de establecer un sistema de seguridad activa anticipandote a los movimientos yacciones en el mapa y el entorno.',
      image: "assets/imgs/slide5.png",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    if (localStorage.getItem('intro') == 'ok') {
      this.navCtrl.setRoot(LoginPage);
    } else {
      localStorage.setItem('intro', 'ok');
    }
  }

  goHome() {
    this.navCtrl.setRoot(LoginPage);
  }

  nextSlide() {
    this.mySlides.slideNext();
  }

}
