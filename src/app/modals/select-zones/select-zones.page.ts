import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController, Events } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-select-zones',
  templateUrl: './select-zones.page.html',
  styleUrls: ['./select-zones.page.scss'],
})
export class SelectZonesPage implements OnInit {

  searchQuery: string = '';
  items;
  zones = new Array;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public events: Events,
    public config: ConfigService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public shared: SharedDataService) {
    this.shared.currentOpenedModel = this;
    loading.show();
    var dat = { zone_country_id: this.navParams.get('id') };
    config.postHttp('getzones', dat).then((data: any) => {
      loading.hide();
      this.items = this.zones = data.data;
    });
  }

  initializeItems() {
    this.items = this.zones
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.zone_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  //close modal
  dismiss() {
    this.modalCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }

  selectZone(c) {
    if (this.navParams.get('page') == 'shipping') {
      if (c == 'other') {
        //  console.log(c);
        this.shared.orderDetails.delivery_zone = 'other';
        this.shared.orderDetails.delivery_state = 'other';
        this.shared.orderDetails.tax_zone_id = null;
      }

      else {
        this.shared.orderDetails.delivery_zone = c.zone_name;
        this.shared.orderDetails.delivery_state = c.zone_name;
        this.shared.orderDetails.tax_zone_id = c.zone_id;
      }
    }
    else if (this.navParams.get('page') == 'editShipping') {
      if (c == 'other') {
        this.shared.tempdata.entry_zone = 'other';
        this.shared.tempdata.entry_zone_id = 0;
      }

      else {
        this.shared.tempdata.entry_zone = c.zone_name;
        this.shared.tempdata.entry_zone_id = c.zone_id;
      }
    }
    else {
      if (c == 'other') {
        this.shared.orderDetails.billing_zone = 'other';
        this.shared.orderDetails.billing_state = 'other';
      }

      else {
        this.shared.orderDetails.billing_zone = c.zone_name;
        this.shared.orderDetails.billing_state = c.zone_name;
      }
    }
    this.dismiss();
  }
  ngOnInit() {
  }
}
