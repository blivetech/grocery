import { Component, OnInit, ApplicationRef } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.page.html',
  styleUrls: ['./shipping-method.page.scss'],
})
export class ShippingMethodPage implements OnInit {

  shippingMethod = new Array;
  selectedMethod = true;
  selectedvalue: any;
  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public http: HttpClient,
    public storage: Storage,
    public spinnerDialog: SpinnerDialog,
    public config: ConfigService,
    public loading: LoadingService,
    public themeableBrowser: ThemeableBrowser,
    private applicationRef: ApplicationRef,
  ) {
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
    dat.language_id = config.langId;
    dat.currency_code = config.currecnyCode;
    this.config.postHttp('getrate', dat).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        var m = data.data.shippingMethods;
        this.shippingMethod = Object.keys(m).map(function (key) { return m[key]; });
        this.shared.orderDetails.total_tax = data.data.tax;
      }
    });
  }
  //================================================================================
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
    this.selectedMethod = false;
    let data = event.detail.value;
    this.shared.orderDetails.shipping_cost = data.rate;
    this.shared.orderDetails.shipping_method = data.name + '(' + data.shipping_method + ')';
  }
  openOrderPage() {
    this.navCtrl.navigateForward(this.config.currentRoute + "/order");
  }
  ngOnInit() {

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
        // attributes: element.attributes,
        // cart_id: element.cart_id,
        // categories: element.categories,
        // customers_basket_quantity: element.customers_basket_quantity,
        // final_price: element.final_price,
        // model: element.model,
        // on_sale: element.on_sale,
        // price: element.price,
        // products_id: element.products_id,
        // products_name: element.products_name,
        // subtotal: element.subtotal,
        // total: element.total,
        // unit: element.unit,
        // weight: element.weight