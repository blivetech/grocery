import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import { HttpClient } from '@angular/common/http';
declare var google;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})

export class ContactUsPage implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  contact = {
    name: '',
    email: '',
    message: ''
  };
  errorMessage = '';

  constructor(
    public http: HttpClient,
    public config: ConfigService,
    public loading: LoadingService,
    public shared: SharedDataService,
  ) {

  }

  ionViewDidLoad() {
    this.loadMap();
  }
  submit() {

    this.loading.autoHide(3000);
    var dat = {};
    dat = this.contact;
    this.config.postHttp('contactus', dat).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.contact.name = '';
        this.contact.email = '';
        this.contact.message = '';
        this.shared.toast(data.message);
      }
    });


  };
  loadMap() {

    let latLng = new google.maps.LatLng(this.config.latitude, this.config.longitude);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = this.config.address;

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  ngOnInit() {
  }

}
