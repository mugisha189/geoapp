import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";

/**
 * Generated class for the FiltersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-filters',
	templateUrl: 'filters.html',
})
export class FiltersPage {

	user: any;
	categories_keys: any;
	categories: any = [];
	alert: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public alertCtrl: AlertController, public toastController: ToastController,
		public loadingCtrl: LoadingController) {
		this.rest.user$.subscribe(data => {
			this.user = data;
		});

		this.rest.alerts$.subscribe(data => {
			for (let i = 0; i < data.alerts.length; i++) {
				if (data.alerts[i].user_id == this.user.id && data.alerts[i].active) {
					this.alert = true;
				}
			}
		});

		this.categories_keys = this.rest.categories;
		this.categories = Object.keys(this.categories_keys);
	}

	ionViewDidLoad() {
	}

	ionViewCanLeave() {
		this.updateUser();
		let loading = this.loadingCtrl.create({
			content: 'Actualizando filtros...',
			spinner: 'bubbles'
		});
		loading.present();
		setTimeout(() => {
			loading.dismiss();
		}, 2000);
	}

	updateUser() {
		this.rest.updateUser(this.user);
	}

	needHelp() {
		const prompt = this.alertCtrl.create({
			title: 'Solicitar ayuda',
			message: "Resume brevemente que te ocurre para que los demás usuarios puedan ayudarte lo antes posible.",
			inputs: [
				{
					name: 'description',
					placeholder: '¿Qué sucede?'
				},
			],
			buttons: [
				{
					text: 'Cancelar',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Solicitar',
					handler: data => {
						this.rest.sendAlert(data.description);
						const toast = this.toastController.create({
							position: 'top',
							message: 'Se ha enviado una petición de ayuda',
							duration: 3000
						});
						toast.present();
						this.alert = true;
					}
				}
			]
		});
		prompt.present();
	}

	deleteHelp() {
		this.rest.deleteAlert();
		const toast = this.toastController.create({
			position: 'top',
			message: 'Se ha eliminado tu petición de ayuda.',
			duration: 3000
		});
		toast.present();
		this.alert = false;
	}


}
