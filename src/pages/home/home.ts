import {
GoogleMaps,
GoogleMap,
GoogleMapsEvent,
CameraPosition,
MarkerOptions,
Marker,
LatLng
} from '@ionic-native/google-maps';
import {NavController, Platform} from 'ionic-angular';
import {Component, ElementRef, ViewChild} from '@angular/core/';
import {mapStyle} from './mapStyle';
import {Geolocation} from "@ionic-native/geolocation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  constructor(public navCtrl: NavController, private _googleMaps: GoogleMaps, platform: Platform, private geoLocation: Geolocation) {
    platform.ready().then(() => {
      this.initMap();
    });
  }

  initMap() {
    let element = this.mapElement.nativeElement;
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
        this.createMarker(loc, 'My Location').then((marker: Marker) => {
          marker.showInfoWindow();
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    });
  }

  moveCamera(loc: LatLng) {
    let options: CameraPosition<any> = {
      target: loc,
      zoom: 15,
      tilt: 10
    };

    this.map.moveCamera(options);
  }

  isNight() {
    let time = new Date().getHours();
    return (time > 5 && time < 19) ? false : true;
  }

  createMarker(loc: LatLng, title: string) {
    let markerOptions : MarkerOptions = {
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
