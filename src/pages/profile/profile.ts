import { Component } from '@angular/core';
import {
	AlertController,
	LoadingController,
	NavController,
	NavParams,
	Platform
} from 'ionic-angular';
import { LoginPage } from "../login/login";
import { RestProvider } from "../../providers/rest/rest";
import { HomePage } from "../home/home";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { environment } from '../../environment/environment';
import { MapPage } from '../map/map';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html',
})
export class ProfilePage {

	user: any;

	tags: any = [];

	photo: any = '';

	user_photo: any = '';
	smallImg = null;

	constructor(public nav: NavController, public navParams: NavParams, public rest: RestProvider,
		private camera: Camera, public navCtrl: NavController, public alertCtrl: AlertController,
		public loading: LoadingController, public platform: Platform) {

		this.platform.registerBackButtonAction(() => {
			this.nav.push(MapPage);
		});

		this.rest.getUser(true);
		this.rest.user$.subscribe(data => {
			this.user = data;
			this.user_photo = environment.fileUrl + '/avatars/' + this.user.photo;
		});

		this.rest.logued$.subscribe(data => {
			if (!data) this.nav_to_login();
		});

	}

	logout() {
		this.rest.logout();
	}

	nav_to_login() {
		localStorage.removeItem('token');
		this.nav.setRoot(LoginPage);
	}

	update() {
		this.rest.updateUser(this.user, true);
		this.navCtrl.setRoot(HomePage);
	}

	selectOption() {
		const confirm = this.alertCtrl.create({
			title: 'Foto Perfil',
			message: '¿Desde dónde desea subir la imagen?',
			buttons: [
				{
					text: 'Cámara',
					handler: () => {
						this.takePhoto(1);
					}
				},
				{
					text: 'Galería',
					handler: () => {
						this.selectGallery(0);
					}
				}
			]
		});
		confirm.present();
	}

	takePhoto(sourceType: number) {
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 600,
			sourceType: this.camera.PictureSourceType.CAMERA,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			cameraDirection: this.camera.Direction.BACK
		};

		this.camera.getPicture(options).then((imageData) => {
			let load = this.loading.create({
				content: 'Subiendo imagen...',
				duration: 5000
			});
			load.present();
			let base64Image = 'data:image/jpeg;base64,' + imageData;
			this.rest.setPhotoProfile(base64Image);
			this.createThumbnail(base64Image);
		}, (err) => {
			// let alert = this.alertCtrl.create({
			//   title: 'Error',
			//   message: err,
			//   buttons: ['Cancelar']
			// });
			// alert.present();
		});
	}

	selectGallery(sourceType: number) {
		const options: CameraOptions = {
			quality: 100,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		};

		this.camera.getPicture(options).then((imageData) => {
			let load = this.loading.create({
				content: 'Subiendo imagen...'
			});
			load.present();
			let base64Image = 'data:image/jpeg;base64,' + imageData;
			this.rest.setPhotoProfile(base64Image);
			this.createThumbnail(base64Image);
			load.dismiss();

		}, (err) => {
			// let alert = this.alertCtrl.create({
			//   title: 'Error',
			//   message: err,
			//   buttons: ['Dismiss']
			// });
			// alert.present();
		});
	}

	createThumbnail(img) {
		this.generateFromImage(img, 200, 200, 0.5, data => {
			this.smallImg = data;
		});
	}

	generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
		var canvas: any = document.createElement("canvas");
		var image = new Image();

		image.onload = () => {
			var width = image.width;
			var height = image.height;

			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			} else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext("2d");

			ctx.drawImage(image, 0, 0, width, height);

			// IMPORTANT: 'jpeg' NOT 'jpg'
			var dataUrl = canvas.toDataURL('image/jpeg', quality);

			callback(dataUrl)
		};
		image.src = img;
	}

}
