import { Component, ViewChild, ElementRef } from '@angular/core';
import {
	FabContainer,
	LoadingController,
	NavController,
	NavParams,
	ModalController,
	AlertController, ToastController
} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { ChatPage } from "../chat/chat";
import { FirebaseProvider } from "../../providers/firebase/firebase";
import { BuddyProfilePage } from "../buddy-profile/buddy-profile";
import { AddMarkerPage } from "../add-marker/add-marker";
import { TranslateService } from '@ngx-translate/core';
import { MarkerInfoPage } from "../marker-info/marker-info";
import { TagsPage } from "../tags/tags";
import { AlertsPage } from "../alerts/alerts";
import { environment } from "../../environment/environment";
import { HomePage } from '../home/home';

declare var google: any;
declare var MarkerClusterer: any;
declare var OverlappingMarkerSpiderfier: any;

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
	selector: 'page-map',
	templateUrl: 'map.html',
})

export class MapPage {

	@ViewChild('map') mapRef: ElementRef;
	@ViewChild('fab') fab: FabContainer;

	private geo_users: Array<any> = [];
	private geo_markers: Array<any> = [];

	categories_keys: any;
	categories: any = [];

	spiderConfig: any;
	markerSpiderfier: any;
	map: any;
	markerClusterer: any;

	user: any;
	active_users: any;
	notifications: any;

	viewInit: any = false;

	lat: any;
	lng: any;
	zoom: any;
	center: any;

	markers: any = [];
	geoMarkers: any = [];
	markers_removed: any = [];
	alerts: any = [];
	newMarkers: any = [];

	category: any = '';
	tag: any = 'all';

	searchBy: string = '';
	selected_filters: any;

	tags: any = [];
	photo: any;

	bg_fab: string = 'dark';
	icon_color: string = 'light';

	// icon_alert: any = {url: '/assets/icon/alert.png', size: new google.maps.Size(54, 54), status: true};
	icon_users: any = { url: '/assets/icon/heart.png', size: new google.maps.Size(54, 54), status: true };
	icon_me: any;

	constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public rest: RestProvider, public storage: Storage, public firebase: FirebaseProvider, private translateService: TranslateService, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, public platform: Platform) {
		this.platform.registerBackButtonAction(() => {
			this.navCtrl.push(HomePage);
		});
		this.categories_keys = this.rest.categories;
		this.categories = Object.keys(this.categories_keys);

		this.rest.category_selected$.subscribe(data => {
			this.category = data;
		});

		this.rest.user$.subscribe(data => {
			this.user = data;
			this.icon_me = {
				url: 'assets/icon/' + this.user.sex + '-default-img.png',
				size: new google.maps.Size(54, 54),
				status: true
			};
			this.firebase.getBuddies(data);
			this.firebase.getNotifications(data).subscribe(data => {
				this.notifications = data;
				this.firebase.setNotifications(data);
			});
			// if(this.user.visibility ) {

			// }
		});

		this.rest.alerts$.subscribe(data => {
			this.alerts = data.alerts;
		});

		this.rest.searchBy$.subscribe(data => {
			this.searchBy = data;
		});

		this.rest.zoom$.subscribe(data => {
			this.zoom = data;
		});

		this.rest.center$.subscribe(data => {
			if (data != '') this.center = data;
		});

		this.rest.selected_filters$.subscribe(data => {
			this.selected_filters = data;
		});


		this.rest.active_users$.subscribe(data => {
			let self = this;
			this.active_users = data;
			if (this.viewInit) {
				let markers = this.markers;
				let markersCluster_delete = this.markerClusterer;
				let new_markers = [];
				let markers_removed = this.markers_removed;
				let map = this.map;
				let category = this.category;

				this.active_users.forEach(function (element) {
					let myLatLng = new google.maps.LatLng(element.position_lat, element.position_lng);
					let marker = markers['user-' + element.id];

					if (marker != undefined && (element.active && !element.visibility && element.category == category.name) || element.id == self.user.id) {
						marker.setPosition(myLatLng);

						if (element.id != self.user.id) marker.setIcon(self.icon_users);
						else marker.setIcon(self.icon_me);
						marker.setAnimation(null);

						// if (element.alert != null && element.alert.active == true) {
						//   marker.setIcon(self.icon_alert);
						//   marker.setAnimation(google.maps.Animation.BOUNCE);
						// }

					} else if ((marker != undefined && !element.active) || (marker != undefined && element.category != category.name) || (marker != undefined && element.visibility)) {
						delete markers['user-' + element.id];
						if (marker.map == null) {
							markersCluster_delete.removeMarker(marker);
						} else {
							if (element.id != self.user.id) {
								markers_removed['user-' + element.id] = marker;
								marker.setMap(null);
							}

						}
					} else if (marker == undefined && element.active && !element.visibility && element.category == category.name) {

						if (markers_removed['user-' + element.id] != undefined) {
							markers_removed['user-' + element.id].setMap(map);
							markers['user-' + element.id] = markers_removed['user-' + element.id];
							delete markers_removed['user-' + element.id];
						} else if (category.name == 'all' && element.active == true) {
							new_markers.push(element);
						} else if (category.name == element.category) {
							// if ((tag == 'all' || tag == element.tag) && element.active == true) {
							new_markers.push(element);
							//}
						}
					}

				});
				if (new_markers.length > 0) {
					self.addMarkerDatas(true, new_markers);
				}

				//Get New Markers
				self.newMarkers = [];
				let tempMarkers = [];
				self.active_users.forEach(function (active_user) {
					if (active_user.marker && active_user.marker.length > 0) {
						active_user.marker.forEach((marker) => {
							if (marker.category_id == self.category.id) {
								marker.user_info = active_user;
								tempMarkers.push(marker);
							}
						});
					}
				});
				const bIds = self.geo_markers.map(item => item.id);
				self.newMarkers = tempMarkers.filter(item => !bIds.some(id => id === item.id));
				if (self.newMarkers.length > 0) {
					self.newMarkers.forEach((element) => {
						self.geo_markers.push(element);
					});
					self.drawNewMarkers(map);
				}
			}
		});

	}


	ionViewDidLeave() {
		// this.rest.setSearch('');
	}

	ionViewWillEnter() {
		this.displayMap();
	}

	ngAfterViewInit() {
		this.displayMap();

		if (this.rest.first_interval) {
			this.rest.first_interval = false;
			this.rest.interval = setInterval(() => {
				if (this.rest.authenticated && this.rest.wifi_enabled && this.rest.call_finished) {
					this.rest.call_finished = false;
					this.geolocation.getCurrentPosition().then((resp) => {
						this.lat = resp.coords.latitude;
						this.lng = resp.coords.longitude;
						this.user.position_lat = this.lat;
						this.user.position_lng = this.lng;
						this.rest.setUser(this.user);
						this.rest.setUserPosition({ 'lat': parseFloat(this.lat), 'lng': parseFloat(this.lng) });

						// this.rest.imHere();
					}).catch((error) => {
						console.log(error);
					});
				}
			}, 10000);
		}
	}

	clickStealthMode() {
		let loading = this.loadingCtrl.create({
			content: 'Actualizando filtros...',
			spinner: 'bubbles'
		});
		loading.present();
		if (this.user.visibility) {
			this.user.visibility = false;
			this.infoInvisibility();
		} else {
			this.user.visibility = true;
			this.infoVisibility();
		}
		this.onChangeCategory(this.category);
		setTimeout(() => {
			loading.dismiss();
		}, 2000);
		this.updateUser();
	}

	updateUser() {
		this.rest.updateUser(this.user);
	}

	// changeCategory() {
	//   this.displayMap();
	// }

	displayMap() {
		this.viewInit = false;

		this.spiderConfig = {
			keepSpiderfied: true,
			event: 'mouseover',
			circleFootSeparation: 60
			// ignoreMapClick: true
		};


		if (this.center == '' || this.center == undefined) {
			this.center = new google.maps.LatLng(parseFloat(this.rest.position_lat), parseFloat(this.rest.position_lng));
		} else {
			this.center = new google.maps.LatLng(parseFloat(this.center.lat()), parseFloat(this.center.lng()));
		}

		const options = {
			center: this.center,
			zoom: this.zoom,
			minZoom: 2,
			maxZoom: 20,
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			clickableIcons: false,
			closeBoxMargin: "10px 20px 2px 2px",
			closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
			closeBoxWidth: 30,
		};

		this.map = new google.maps.Map(this.mapRef.nativeElement, options);

		if (this.user.visibility) {
			this.hideInterface();
			this.bg_fab = 'light';
			this.icon_color = 'dark';
		} else {
			this.bg_fab = 'dark';
			this.icon_color = 'light';
			this.map.setOptions({
				styles: {}
			});
		}

		if (typeof google === 'object' && typeof google.maps === 'object') {

			this.markerSpiderfier = new OverlappingMarkerSpiderfier(this.map, this.spiderConfig);
			this.markerClusterer = new MarkerClusterer(this.map, [], {
				maxZoom: 16,
				imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
			});

			this.addMarkerDatas();
		}

		let self = this;

		this.map.addListener('dblclick', function (event) {
			let latitude = event.latLng.lat();
			let longitude = event.latLng.lng();

			if (self.user.category.name != 'free' && self.user.category.name != 'heart') {
				self.navCtrl.push(AddMarkerPage, {
					latitude: latitude,
					longitude: longitude
				});
			}

			// marker_timeout = setTimeout(function(){
			//   self.navCtrl.push(AddMarkerPage, {
			//     latitude: latitude,
			//     longitude: longitude
			//   });
			//   }, 3000);

		});

		this.map.addListener('zoom_changed', function (event) {
			self.rest.setZoom(self.map.zoom);
		});

		this.map.addListener('center_changed', function (event) {
			self.rest.setCenter(self.map.center);
		});

		// this.map.addListener('drag', function (event) {
		//   clearTimeout(marker_timeout);
		// });

	}

	addBookMark() {
		this.createToast('Puede deslizarse por el mapa y hacer doble clic para establecer un marcador en ese punto.', 3000, 'top');
	}

	createToast(message, time, position) {
		const toast = this.toastCtrl.create({
			position: position,
			message: message,
			duration: time
		});
		toast.present();
	}

	addMarkerDatas(first_time = false, new_markers = null) {

		let map = this.map;

		this.geo_users = [];
		this.geo_markers = [];
		let users_makers = [];
		if (!first_time) users_makers = this.active_users;
		else users_makers = new_markers;

		for (let active_user of users_makers) {

			if ((this.category.name == 'all' && active_user.active == true) || active_user.id == this.user.id) {
				this.geo_users.push(active_user);

			} else if ((this.category.name == active_user.category && active_user.active == true) || active_user.id == this.user.id) {
				//if ((this.tag == 'all' && active_user.active == true) || active_user.id == this.user.id)
				if ((active_user.name && this.compareWithSearch(active_user.name, this.searchBy)) || (active_user.description && this.compareWithSearch(active_user.description, this.searchBy))) {
					if (this.selected_filters == '') this.geo_users.push(active_user);
					else if (this.selected_filters != '' && this.comparefiltersSex(this.selected_filters, active_user)) {
						this.geo_users.push(active_user);
					}
				}
				//else if ((this.tag == active_user.tag && active_user.active == true) || active_user.id == this.user.id) this.geo_users.push(active_user);
			}

			if (this.category.isMarker) {
				for (let marker of active_user.marker) {
					if (marker.category_id == this.category.id) {
						marker.user_info = active_user;
						if ((marker.info && this.compareWithSearch(marker.info, this.searchBy)) || (marker.title && this.compareWithSearch(marker.title, this.searchBy))) {
							if (this.selected_filters == '') this.geo_markers.push(marker);
							else if (this.selected_filters != '' && this.comparefilters(this.selected_filters, marker.filters)) {
								this.geo_markers.push(marker);
							}
						}
					}
				}
			}
		}

		this.drawUsers(map);
		this.drawMarkers(map);

	}


	// Sets the map on all markers in the array.
	setMapOnAll() {
		let self = this;
		google.maps.Map.prototype.clearMarkers = function () {
			for (let i = 0; i < self.geoMarkers.length; i++) {
				self.geoMarkers[i].setMap(null);
			}
			self.geoMarkers = [];
		};
	}

	drawNewMarkers(map) {
		let self = this;

		let lastOpenedInfoWindow;

		this.newMarkers.map(function (marker, i) {
			let active_user = marker.user_info;

			let googleMarker = new google.maps.Marker({
				title: marker.title + '-' + marker.id,
				position: { lat: parseFloat(marker.position_lat), lng: parseFloat(marker.position_lng) },
				icon: {
					scaledSize: new google.maps.Size(54, 54),
					url: 'assets/icon/home.png'
				},
				map
			});

			self.geoMarkers[marker.id] = marker;

			let contenido = '<div style="display:flex;flex-flow:row nowrap; align-items: center;">' +
				'<div style="min-width: 13rem;">' +
				'<p class="start-chat-map name" id="infoMarker">' + marker.title + '</p>' +
				'<button class="start-chat-map init-chat" id="goChat">Chat</button>' +
				'</div>' +
				'</div>';

			let infowindow = new google.maps.InfoWindow({
				content: contenido
			});

			google.maps.event.addListener(googleMarker, 'spider_click', function () {

				if (lastOpenedInfoWindow) {
					lastOpenedInfoWindow.close();
				}

				map.panTo(googleMarker.getPosition());
				infowindow.open(map, googleMarker);
				lastOpenedInfoWindow = infowindow;
				self.rest.setUserChat(active_user);
			});


			google.maps.event.addListener(infowindow, 'domready', () => {

				let clickableItem = document.getElementById('goChat');
				clickableItem.onclick = function () {
					if (active_user.id == self.user.id) {
						self.createToast('Este es tu marcador. no puedes chatear', 3000, 'top');
						return;
					}
					infowindow.close();
					self.rest.setUserChat(active_user);
					self.navCtrl.push(ChatPage, {}, {
						animate: true,
						animation: 'transition',
						duration: 400,
						direction: 'forward'
					});
				};

				let clickableMarker = document.getElementById('infoMarker');
				clickableMarker.onclick = function () {
					infowindow.close();
					self.rest.setUserChat(active_user);
					self.navCtrl.push(MarkerInfoPage, { 'marker': marker }, {
						animate: true,
						animation: 'transition',
						duration: 400,
						direction: 'forward'
					});
				};

			});

			self.markerSpiderfier.addMarker(googleMarker);
			self.markerClusterer.addMarker(googleMarker);

		});
		this.newMarkers = [];
		// self.markerSpiderfier.addListener('format', function (marker, status) {
		//
		//   if (marker.title == self.user.name + '-' + self.user.id) self.photo = 'assets/icon/' + self.user.sex + '-default-img.png';
		//   else self.photo = marker.icon.url;
		//   let iconURL = self.photo;
		//   marker.setIcon({
		//     url: iconURL,
		//     scaledSize: new google.maps.Size(54, 54) // makes SVG icons work in IE
		//   });
		// });


		this.viewInit = true;

		return 'ok';
	}

	drawMarkers(map) {
		let self = this;

		let lastOpenedInfoWindow;

		this.geo_markers.map(function (marker, i) {
			let active_user = marker.user_info;

			let googleMarker = new google.maps.Marker({
				title: marker.title + '-' + marker.id,
				position: { lat: parseFloat(marker.position_lat), lng: parseFloat(marker.position_lng) },
				icon: {
					scaledSize: new google.maps.Size(54, 54),
					url: 'assets/icon/home.png'
				},
				map
			});

			self.geoMarkers[marker.id] = marker;

			let contenido = '<div style="display:flex;flex-flow:row nowrap; align-items: center;">' +
				'<div style="min-width: 13rem;">' +
				'<p class="start-chat-map name" id="infoMarker">' + marker.title + '</p>' +
				'<button class="start-chat-map init-chat" id="goChat">Chat</button>' +
				'</div>' +
				'</div>';

			let infowindow = new google.maps.InfoWindow({
				content: contenido
			});

			google.maps.event.addListener(googleMarker, 'spider_click', function () {

				if (lastOpenedInfoWindow) {
					lastOpenedInfoWindow.close();
				}

				map.panTo(googleMarker.getPosition());
				infowindow.open(map, googleMarker);
				lastOpenedInfoWindow = infowindow;
				self.rest.setUserChat(active_user);
			});


			google.maps.event.addListener(infowindow, 'domready', () => {

				let clickableItem = document.getElementById('goChat');
				clickableItem.onclick = function () {
					if (active_user.id == self.user.id) {
						self.createToast('Este es tu marcador. no puedes chatear', 3000, 'top');
						return;
					}
					infowindow.close();
					self.rest.setUserChat(active_user);
					self.navCtrl.push(ChatPage, {}, {
						animate: true,
						animation: 'transition',
						duration: 400,
						direction: 'forward'
					});
				};

				let clickableMarker = document.getElementById('infoMarker');
				clickableMarker.onclick = function () {
					infowindow.close();
					self.rest.setUserChat(active_user);
					self.navCtrl.push(MarkerInfoPage, { 'marker': marker }, {
						animate: true,
						animation: 'transition',
						duration: 400,
						direction: 'forward'
					});
				};

			});

			self.markerSpiderfier.addMarker(googleMarker);
			self.markerClusterer.addMarker(googleMarker);

		});

		// self.markerSpiderfier.addListener('format', function (marker, status) {
		//
		//   if (marker.title == self.user.name + '-' + self.user.id) self.photo = 'assets/icon/' + self.user.sex + '-default-img.png';
		//   else self.photo = marker.icon.url;
		//   let iconURL = self.photo;
		//   marker.setIcon({
		//     url: iconURL,
		//     scaledSize: new google.maps.Size(54, 54) // makes SVG icons work in IE
		//   });
		// });


		this.viewInit = true;

		return 'ok';
	}

	drawUsers(map) {
		let self = this;

		let lastOpenedInfoWindow;

		this.geo_users.map(function (active_user, i) {

			if (self.user.id == active_user.id) {
				self.photo = self.user.sex + '-default-img.png';
			} else {
				self.photo = 'heart.png';
			}

			let marker = new google.maps.Marker({
				title: active_user.name + '-' + active_user.id,
				position: { lat: parseFloat(active_user.position_lat), lng: parseFloat(active_user.position_lng) },
				icon: {
					scaledSize: new google.maps.Size(54, 54),
					url: 'assets/icon/' + self.photo
				},
				map
			});

			self.markers['user-' + active_user.id] = marker;

			if (self.user.id != active_user.id) {
				let contenido = '<div style="display:flex;flex-flow:row nowrap; align-items: center;">' +
					'<div class="avatar-user-map">' +
					'<img id="goProfile" class="img-profile" src="' + environment.fileUrl + '/avatars/' + active_user.photo + '" alt="">' +
					'</div>' +
					'<div class="info-user-map">' +
					'<div class="start-chat-map name">' +
					'<div style="width: 100%;">' +
					active_user.name +
					'</div>' +
					'</div>' +
					'<button class="start-chat-map init-chat" id="goChat">' + '<div style="width: 100%;">Chat</div>' + '</button>' +
					'</div>' +
					'</div>';

				let infowindow = new google.maps.InfoWindow({
					content: contenido
				});

				google.maps.event.addListener(marker, 'spider_click', function () {

					let icon_url = marker.getIcon().url;

					if (icon_url == 'assets/icon/' + self.category.name + '-group.png') return 'no-info';

					if (lastOpenedInfoWindow) {
						lastOpenedInfoWindow.close();
					}

					map.panTo(marker.getPosition());
					infowindow.open(map, marker);
					lastOpenedInfoWindow = infowindow;
					self.rest.setUserChat(active_user);
				});


				google.maps.event.addListener(infowindow, 'domready', () => {

					let clickableItem = document.getElementById('goChat');
					clickableItem.onclick = function () {
						if (active_user.id == self.user.id) {
							self.createToast('Este es tu marcador. no puedes chatear', 3000, 'top');
							return;
						}
						self.rest.setUserChat(active_user);
						self.navCtrl.push(ChatPage, {}, {
							animate: true,
							animation: 'transition',
							duration: 400,
							direction: 'forward'
						});
					};

					let clickableImg = document.getElementById('goProfile');
					clickableImg.onclick = function () {
						self.rest.setUserChat(active_user);
						self.navCtrl.push(BuddyProfilePage, {}, {
							animate: true,
							animation: 'transition',
							duration: 400,
							direction: 'forward'
						});
					};

				});
			}

			self.markerSpiderfier.addMarker(marker);
			self.markerClusterer.addMarker(marker);

		});

		self.markerSpiderfier.addListener('format', function (marker, status) {

			if (marker.title == self.user.name + '-' + self.user.id) self.photo = 'assets/icon/' + self.user.sex + '-default-img.png';
			else self.photo = marker.icon.url;
			let iconURL = self.photo;
			marker.setIcon({
				url: iconURL,
				scaledSize: new google.maps.Size(54, 54) // makes SVG icons work in IE
			});
		});

		this.viewInit = true;

		return 'ok';
	}

	onChangeCategory(e) {
		console.log('asdf');
		this.category = e;
		this.fab.close();
		this.tag = 'all';
		this.tags = [];
		this.rest.setCategory(e);
		this.rest.setSelectedFilters('');
		this.displayMap();
	}

	onChangeTag(e) {
		this.tag = e;
		this.zoom = this.map.getZoom();
		this.displayMap();
	}

	centerPosition() {
		let latLng = new google.maps.LatLng(this.user.position_lat, this.user.position_lng);
		this.map.setCenter(latLng);
		this.map.setZoom(12);
		this.displayMap();
	}

	infoVisibility() {
		this.createToast('Estás en Modo Oculto, ningún usuario puede verte.', 3000, 'top');
	}

	infoInvisibility() {
		this.createToast('No estás en modo oculto, todos los usuarios pueden verte.', 3000, 'top');
	}

	hideInterface() {
		this.map.setOptions({
			styles: [
				{
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#242f3e"
						}
					]
				},
				{
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#746855"
						}
					]
				},
				{
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"color": "#242f3e"
						}
					]
				},
				{
					"featureType": "administrative.locality",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#d59563"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#d59563"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#263c3f"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#6b9a76"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#38414e"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#212a37"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#9ca5b3"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#746855"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#1f2835"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#f3d19c"
						}
					]
				},
				{
					"featureType": "transit",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#2f3948"
						}
					]
				},
				{
					"featureType": "transit.station",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#d59563"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#17263c"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#515c6d"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"color": "#17263c"
						}
					]
				}
			]
		});
	}

	clearSearch() {
		this.rest.setSearch('');
		this.displayMap();
	}

	search() {
		const prompt = this.alertCtrl.create({
			title: 'Buscar',
			message: "Filtra el texto que quieras buscar en la descripción de usuarios o marcadores.",
			inputs: [
				{
					name: 'title',
					placeholder: 'texto'
				},
			],
			buttons: [
				{
					text: 'Cancelar',
					handler: data => {

					}
				},
				{
					text: 'Buscar',
					handler: data => {
						this.rest.setSearch(data.title);
						this.displayMap();
					}
				}
			]
		});
		prompt.present();
	}

	compareWithSearch(text, item) {
		let re = new RegExp(item.toLowerCase(), 'g');
		let res = text.toLowerCase().match(re);
		return !!res;
	}

	openFilters() {
		this.navCtrl.push(TagsPage);
	}

	openAlerts() {
		this.navCtrl.push(AlertsPage);
	}

	comparefilters(obj1, obj2) {

		let valores1 = Object.keys(obj1).map(function (e) {
			return obj1[e]
		});
		let valores2 = Object.keys(JSON.parse(obj2)).map(function (e) {
			return JSON.parse(obj2)[e]
		});

		for (let i = 0; i < valores1.length; i++) {
			if (String(valores2[i]).toLowerCase() == String(valores1[i]).toLowerCase() || valores1[i] == null) {
				console.log('ok');
			} else {
				return false;
			}
		}

		return true;
	}

	comparefiltersSex(filter, user) {
		var today = new Date().getFullYear();
		var age = today - new Date(user.birthdate).getFullYear();
		var sex = user.sex;

		if (age >= filter.age.lower && age <= filter.age.upper) {

			if ((filter.sex && filter.sex == sex) || !filter.sex) {
				return true;
			}

		} else return false;
	}

}


