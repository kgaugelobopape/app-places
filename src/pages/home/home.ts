import {AlertController, NavController} from 'ionic-angular';
import {Component} from '@angular/core/';
import {mapStyle} from './mapStyle';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  CameraPosition,
  Marker,
  MarkerOptions,
  LatLng
} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private _googleMaps: GoogleMaps, private geoLocation: Geolocation) {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    let element = document.getElementById('map');
    let loc: LatLng = new LatLng(40.7128, -74.0059);
    let style = [];

    if (this.isNight()) {
      style = mapStyle
    }

    this.map = this._googleMaps.create(element, {styles: style});

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.getCurrentLocation().then((position) => {
        loc = new LatLng(position.coords.latitude, position.coords.longitude);
        this.moveCamera(loc);
        this.setOptions();
        this.createMarker(loc, 'Current Location').then((marker: Marker) => {
          marker.showInfoWindow();
        });
      }).catch((err) => {
        this.showAlert(err);
      });
    });
  }

  showAlert(error) {
    let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      buttons: ['OK']
    });
    alert.present();
  }

  moveCamera(loc: LatLng) {
    let options: CameraPosition<any> = {
      target: loc,
      zoom: 16,
      tilt: 10
    };

    this.map.moveCamera(options);
  }

  isNight() {
    let time = new Date().getHours();
    return (time > 5 && time < 19) ? false : true;
  }

  createMarker(loc: LatLng, title: string) {
    let markerOptions: MarkerOptions = {
      position: loc,
      title: title,
      animation: 'DROP'
    };

    return this.map.addMarker(markerOptions);
  }

  getCurrentLocation() {
    return this.geoLocation.getCurrentPosition();
  }

  setOptions() {
    this.map.setOptions({
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': false,
        'mapToolbar': true
      }
    });
  }
}
