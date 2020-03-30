import { Component, OnInit } from '@angular/core';
import { Events, ModalController, NavParams } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { SelectZonesPage } from '../select-zones/select-zones.page';
import { SelectCountryPage } from '../select-country/select-country.page';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  shippingData: { [k: string]: any } = {};
  data;
  type = 'update';
  constructor(
    public events: Events,
    public config: ConfigService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public shared: SharedDataService,
    public navParams: NavParams,
  ) {

    this.data = navParams.get('data');
    this.type = navParams.get('type');

    if (this.type != 'add') {
      this.shippingData.entry_firstname = this.data.firstname;
      this.shippingData.entry_lastname = this.data.lastname;
      this.shippingData.entry_street_address = this.data.street;
      this.shippingData.entry_country_name = this.data.country_name;
      this.shippingData.entry_zone = this.data.zone_name;
      this.shippingData.entry_postcode = this.data.postcode;
      this.shippingData.entry_country_id = this.data.countries_id;
      this.shippingData.entry_address_id = this.data.address_id;
      this.shippingData.entry_city = this.data.city;
      this.shippingData.entry_zone_id = this.data.zone_id;
      this.shippingData.entry_state = this.data.state;
      this.shippingData.suburb = this.data.suburb;
      this.shippingData.address_id = this.data.address_id;
    }
  }

  async selectCountryPage() {
    let modal = await this.modalCtrl.create({
      component: SelectCountryPage,
      componentProps: { page: 'editShipping' }
    });
    modal.onDidDismiss().then(() => {
      this.updateCountryZone();
    })
    return await modal.present();
  }
  async selectZonePage() {

    let modal = await this.modalCtrl.create({
      component: SelectZonesPage,
      componentProps: { page: 'editShipping', id: this.shippingData.entry_country_id }
    });
    modal.onDidDismiss().then(() => {
      this.updateCountryZone();
    })
    return await modal.present();
  }
  //close modal
  dismiss() {
    this.modalCtrl.dismiss();
  }

  //============================================================================================  
  //adding shipping address of the user
  addShippingAddress = function (form) {
    this.loading.show();
    this.shippingData.customers_id = this.shared.customerData.customers_id;
    var dat = this.shippingData;
    //dat.entry_state = dat.delivery_zone;
    // dat.entry_zone = dat.delivery_zone;
    dat.is_default = 0;
    this.config.postHttp('addshippingaddress', dat).then((data: any) => {
      this.loading.hide();
      this.dismiss();
      this.shared.toast(data.message);
    }, function (response) {
      this.loading.hide();
      console.log(response);
    });
  };
  //============================================================================================  
  //updating shipping address of the user
  updateShippingAddress = function (form, id) {
    this.loading.show();
    this.shippingData.customers_id = this.shared.customerData.customers_id;
    var dat = this.shippingData;
    //dat.entry_state = dat.delivery_zone;
    //dat.entry_zone = dat.delivery_zone;
    dat.is_default = 0;
    this.config.postHttp('updateshippingaddress', dat).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.dismiss();
        this.shared.toast(data.message);
      }
    }, function (response) {
      this.loading.hide();
      console.log(response);
    });

  };
  updateCountryZone() {
    console.log(this.shared.tempdata.entry_country_id);
    if (this.shared.tempdata.entry_country_id != undefined) {

      this.shippingData.entry_country_id = this.shared.tempdata.entry_country_id;
      this.shippingData.entry_country_name = this.shared.tempdata.entry_country_name;
      this.shippingData.entry_country_code = this.shared.tempdata.entry_country_code;
      this.shippingData.entry_zone = this.shared.tempdata.entry_zone;

    }
    if (this.shared.tempdata.entry_zone != undefined) {
      this.shippingData.entry_zone = this.shared.tempdata.entry_zone;
      this.shippingData.entry_zone_id = this.shared.tempdata.entry_zone_id;
    }
  }

  ngOnInit() {
  }

}
