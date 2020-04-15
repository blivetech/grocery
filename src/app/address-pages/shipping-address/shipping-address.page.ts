import { Component, OnInit, ApplicationRef } from '@angular/core';


import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ModalController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/providers/loading/loading.service';
import { UserAddressService } from 'src/providers/user-address/user-address.service';
import { SelectCountryPage } from 'src/app/modals/select-country/select-country.page';
import { SelectZonesPage } from 'src/app/modals/select-zones/select-zones.page';
@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.page.html',
  styleUrls: ['./shipping-address.page.scss'],
})
export class ShippingAddressPage implements OnInit {
  shippingMethod;
  total_tax:number;
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public http: HttpClient,
    public shared: SharedDataService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    private applicationRef: ApplicationRef,

    public userAddress: UserAddressService, ) {
    if (this.shared.orderDetails.guest_status == 0) {
      this.getUserAddress();
    }
  }
  getUserAddress() {
    this.loading.show();
    var dat: { [k: string]: any } = {};
    dat.customers_id = this.shared.customerData.customers_id;
    this.config.postHttp('getalladdress', dat).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        var allShippingAddress = data.data;
        for (let value of allShippingAddress) {
          if (value.default_address != null || allShippingAddress.length == 1) {
            this.shared.orderDetails.tax_zone_id = value.zone_id;
            this.shared.orderDetails.delivery_firstname = value.firstname;
            this.shared.orderDetails.delivery_lastname = value.lastname;
            this.shared.orderDetails.delivery_state = value.state;
            this.shared.orderDetails.delivery_city = value.city;
            this.shared.orderDetails.delivery_postcode = value.postcode;
            this.shared.orderDetails.delivery_zone = value.zone_name;
            this.shared.orderDetails.delivery_country = value.country_name;
            this.shared.orderDetails.delivery_country_id = value.countries_id;
            this.shared.orderDetails.delivery_street_address = value.street;
            // if ($rootScope.zones.length == 0)
            if (value.zone_code == null) {
              //  console.log(c);
              this.shared.orderDetails.delivery_zone = 'other';
              this.shared.orderDetails.delivery_state = 'other';
              this.shared.orderDetails.tax_zone_id = null;
            }
          }

        }
      }
      if (data.success == 0) { }
    });

    this.shared.orderDetails.delivery_phone = this.shared.customerData.customers_telephone;
  }
  async selectCountryPage() {

    let modal = await this.modalCtrl.create({
      component: SelectCountryPage,
      componentProps: { page: 'shipping' }
    });

    return await modal.present();
  }

  async selectZonePage() {

    let modal = await this.modalCtrl.create({
      component: SelectZonesPage,
      componentProps: { page: 'shipping', id: this.shared.orderDetails.delivery_country_id }
    });

    return await modal.present();
  }
  submit() {
    this.shared.orderDetails.billing_firstname = this.shared.orderDetails.delivery_firstname;
    this.shared.orderDetails.billing_lastname = this.shared.orderDetails.delivery_lastname;
    this.shared.orderDetails.billing_state = this.shared.orderDetails.delivery_state;
    this.shared.orderDetails.billing_city = this.shared.orderDetails.delivery_city;
    this.shared.orderDetails.billing_postcode = this.shared.orderDetails.delivery_postcode;
    this.shared.orderDetails.billing_zone = this.shared.orderDetails.delivery_zone;
    this.shared.orderDetails.billing_country = this.shared.orderDetails.delivery_country;
    this.shared.orderDetails.billing_country_id = this.shared.orderDetails.delivery_country_id;
    this.shared.orderDetails.billing_street_address = this.shared.orderDetails.delivery_street_address;
    this.shared.orderDetails.billing_phone = this.shared.orderDetails.delivery_phone;
    this.shared.orderDetails.shipping_cost = '0';
    this.shared.orderDetails.shipping_method = 'Free Delivery(flateRate)';

    this.calculateTax();


  
  //  this.navCtrl.navigateForward(this.config.currentRoute + "/shipping-method");
    this.applicationRef.tick();
  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.shared.customerData.customers_id == null) {
      this.shared.orderDetails.tax_zone_id = '';
      this.shared.orderDetails.delivery_firstname = '';
      this.shared.orderDetails.delivery_lastname = '';
      this.shared.orderDetails.delivery_state = '';
      this.shared.orderDetails.delivery_city = '';
      this.shared.orderDetails.delivery_postcode = '';
      this.shared.orderDetails.delivery_zone = '';
      this.shared.orderDetails.delivery_country = '';
      this.shared.orderDetails.delivery_country_id = '';
      this.shared.orderDetails.delivery_street_address = '';
    }

  }
    calculateTax(){
    this.loading.show();
    var dat: { [k: string]: any } = {};
    dat.tax_zone_id = this.shared.orderDetails.tax_zone_id;
    // data.shipping_method = this.shared.orderDetails.shipping_method;
    // data.shipping_method = 'upsShipping';
    // data.shipping_method_code = this.shared.orderDetails.shipping_method_code;
    dat.state = this.shared.orderDetails.delivery_state;
    dat.city = this.shared.orderDetails.delivery_city;
    dat.country_id = this.shared.orderDetails.delivery_country_id;
    dat.postcode = this.shared.orderDetails.delivery_postcode;
    dat.zone = this.shared.orderDetails.delivery_zone;
    dat.street_address = this.shared.orderDetails.delivery_street_address;
    
    dat.products_weight = this.calculateWeight();
    dat.products_weight_unit = 'g'
    dat.products = this.getProducts();
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp('getrate', dat).then((data: any) => {
    
      if (data.success == 1) {
        try {
          var m = data.data.shippingMethods;
          console.log(m);
          this.shippingMethod = Object.keys(m).map(function (key) { return m[key]; });
          this.shared.orderDetails.total_tax = data.data.tax;
          console.log( "tax::"+this.shared.orderDetails.total_tax );
          setTimeout(() => {
            this.navCtrl.navigateForward(this.config.currentRoute + "/order");
          }, 1000);
          this.loading.hide();
        } catch (error) {
          console.log(JSON.stringify(error));
        }
       
      }
    });
   
   
    }
    //calcualting products total weight
    calculateWeight = function () {
      var pWeight = 0;
      var totalWeight = 0;
      for (let value of this.shared.cartProducts) {
        pWeight = parseFloat(value.weight);
        if (value.unit == 'kg') {
          pWeight = parseFloat(value.weight) * 1000;
        }
        //  else {
        totalWeight = totalWeight + (pWeight * value.customers_basket_quantity);
        //   }
        //  console.log(totalWeight);
      }
      return totalWeight;
    };
    setMethod(event) {
     // this.selectedMethod = false;
      let data = event.detail.value;
      this.shared.orderDetails.shipping_cost = data.rate;
      this.shared.orderDetails.shipping_method = data.name + '(' + data.shipping_method + ')';
      console.log("cost:"+this.shared.orderDetails.shipping_cost);
      console.log("method:"+this.shared.orderDetails.shipping_method);
    }

    getProducts() {
      let temp = [];
      this.shared.cartProducts.forEach(element => {
        temp.push({
          customers_basket_quantity: element.customers_basket_quantity,
          final_price: element.final_price,
          price: element.price,
          products_id: element.products_id,
          total: element.total,
          unit: element.unit,
          weight: element.weight
        })
      });
      return temp;
    }
}
