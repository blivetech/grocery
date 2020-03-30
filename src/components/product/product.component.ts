import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { ToastController, Events, ModalController, NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';

import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoginPage } from 'src/app/modals/login/login.page';
@Component({
  selector: 'app-product',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  @Input('data') p;//product data
  @Input('type') type;
  // @Output() someEvent = new EventEmitter();

  expired = false;
  is_upcomming = false;
  constructor(public config: ConfigService,
    public shared: SharedDataService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public events: Events,
    private storage: Storage,
    public loading: LoadingService,

  ) {
    // flash_expires_date
    // flash_start_date
    // server_time
    events.subscribe('wishListUpdate', (id, value) => {
      if (this.p.products_id == id) this.p.isLiked = value
    });

    events.subscribe('productExpired', (id) => {
      if (this.p.products_id == id) this.productExpired();
    });
  }
  productExpired() {
    console.log("expired " + this.p.products_name);
    this.expired = true
  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.p.products_price);
    var p2 = parseInt(this.p.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }

  showProductDetail() {
    if (this.type == 'flash') {
      this.loading.show();
      var dat: { [k: string]: any } = {};
      if (this.shared.customerData != null)
        dat.customers_id = this.shared.customerData.customers_id;
      else
        dat.customers_id = null;

      dat.products_id = this.p.products_id;
      dat.language_id = this.config.langId;
      dat.currency_code = this.config.currecnyCode;
      dat.type = 'flashsale';
      this.config.postHttp('getallproducts', dat).then((data: any) => {
        this.loading.hide();
        if (data.success == 1) {
          this.shared.singleProductPageData.push(data.product_data[0]);
          this.navCtrl.navigateForward(this.config.currentRoute + "/product-detail/" + this.p.products_id);
        }
      }, err => {
        console.log(err);
      });
    }
    else {
      this.shared.singleProductPageData.push(this.p);
      this.navCtrl.navigateForward(this.config.currentRoute + "/product-detail/" + this.p.products_id);
    }

    if (this.type != 'recent' && this.type != 'flash') this.shared.addToRecent(this.p);
  }

  checkProductNew() {
    var pDate = new Date(this.p.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }

  addToCart() { this.shared.addToCart(this.p, []); }

  isInCart() {
    var found = false;

    for (let value of this.shared.cartProducts) {
      if (value.products_id == this.p.products_id) { found = true; }
    }

    if (found == true) return true;
    else return false;
  }
  removeRecent() {
    this.shared.removeRecent(this.p);

  }

  async clickWishList() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = await this.modalCtrl.create({
        component: LoginPage,
        componentProps: {
          'hideGuestLogin': true
        }
      });
      await modal.present();
    }
    else {
      if (this.p.isLiked == '0') { this.addWishList(); }
      else this.removeWishList();
    }
  }
  addWishList() {
    this.shared.addWishList(this.p);
  }
  removeWishList() {
    this.shared.removeWishList(this.p);
  }

  ngOnInit() {
    if (this.type == 'flash') {
      if (this.p.server_time < this.p.flash_start_date) this.is_upcomming = true;
      //console.log("server time less than " + (this.p.server_time - this.p.flash_start_date));
    }
  }
}
