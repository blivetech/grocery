import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from 'src/providers/config/config.service';
import { ModalController, Events, IonSearchbar, NavParams } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-select-country',
  templateUrl: './select-country.page.html',
  styleUrls: ['./select-country.page.scss'],
})
export class SelectCountryPage implements OnInit {
  @ViewChild('Searchbar', { static: false }) searchBar: IonSearchbar;

  searchQuery: string = '';
  items;
  countries = new Array;

  constructor(
    public http: HttpClient,
    public events: Events,
    public config: ConfigService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public shared: SharedDataService,
    public navParams: NavParams, ) {


    this.shared.currentOpenedModel = this;

    loading.show();
    var dat = { type: 'null' };
    config.postHttp('getcountries', dat).then((data: any) => {
      loading.hide();
      this.items = this.countries = data.data
      setTimeout(() => { this.searchBar.setFocus(); }, 250);
    });

  }

  initializeItems() {
    this.items = this.countries
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.countries_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  //close modal
  dismiss() {
    this.modalCtrl.dismiss();
    this.shared.currentOpenedModel = null;
  }
  selectCountry(c) {
    if (this.navParams.get('page') == 'shipping') {
      this.shared.orderDetails.delivery_country = c.countries_name;
      this.shared.orderDetails.delivery_country_code = c.countries_id;
      this.shared.orderDetails.delivery_country_id = c.countries_id;
      this.shared.orderDetails.delivery_zone = null;
      this.shared.orderDetails.delivery_state = null;
    }
    else if (this.navParams.get('page') == 'editShipping') {
      this.shared.tempdata.entry_country_id = c.countries_id;
      this.shared.tempdata.entry_country_name = c.countries_name;
      this.shared.tempdata.entry_country_code = c.countries_id;
      this.shared.tempdata.entry_zone = null;
    }
    else {
      this.shared.orderDetails.billing_country = c.countries_name;
      this.shared.orderDetails.billing_country_code = c.countries_id;
      this.shared.orderDetails.billing_country_id = c.countries_id;
      this.shared.orderDetails.billing_zone = null;
      this.shared.orderDetails.billing_state = null;
    }
    this.dismiss();
    console.log(this.navParams.get('page'));
  }

  ngOnInit() {
  }

}
