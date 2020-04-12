import { Component, OnInit, ApplicationRef, ViewEncapsulation } from '@angular/core';
import { NavController, ModalController, Events } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { HttpClient } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { LoginPage } from '../modals/login/login.page';

@Component({
  selector: 'app-product-detail',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  public product;

  attributes = [];
  selectAttribute = true;
  discount_price;
  flash_price;
  product_price;
  cartButton = "addToCart";
  is_upcomming = false;
  public isLiked = 0;
  public wishArray = [];
  public disableCartButton = false;
  public variations = new Array;
  public groupProducts = new Array;
  public variationPrice = null;
  public loaderWcVendorInfo = false;
  public wcVendorInfo: any;
  public loaderProductVariations = false;
  pId: any;
  sliderConfigReleatedItems = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }
  sliderConfig = {
    zoom: true
  }
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public shared: SharedDataService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public iab: InAppBrowser,
    public events: Events,
    private storage: Storage,
    private photoViewer: PhotoViewer,
    private socialSharing: SocialSharing,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.pId = this.activatedRoute.snapshot.paramMap.get('id');
    this.product = JSON.parse(JSON.stringify(this.getProductData(this.pId)));
     console.log(this.product);
    this.discount_price = this.product.discount_price;
    this.product_price = this.product.products_price;
    this.flash_price = this.product.flash_price;
    if (this.product.products_type == 0 && this.product.defaultStock <= 0) this.cartButton = "outOfStock";
    if (this.product.products_type == 1) this.cartButton = "addToCart";
    if (this.product.products_type == 2) this.cartButton = "external";

    if (this.product.attributes != null && this.product.attributes != undefined && this.product.attributes.length != 0) {
      //this.selectAttribute = this.product.attributes[0].values[0];
      // console.log(this.selectAttribute);
      this.product.attributes.forEach((value, index) => {

        var att = {
          products_options_id: value.option.id,
          products_options: value.option.name,
          products_options_values_id: value.values[0].id,
          options_values_price: value.values[0].price,
          price_prefix: value.values[0].price_prefix,
          products_options_values: value.values[0].value,
          attribute_id: value.values[0].products_attributes_id,
          name: value.values[0].value + ' ' + value.values[0].price_prefix + value.values[0].price + " " + this.config.currency
        };

        this.attributes.push(att);
      });
      this.checkAvailability();
      console.log(this.attributes);
    }
  }
  zoomImage(img) {
    this.photoViewer.show(img);
  }
  getProductData(id) {
    let p;
    this.shared.singleProductPageData.forEach(element => {
      if (element.products_id == id) {
        p = element;
      }
    });
    return p;
  }
  checkAvailability() {
    this.loading.show();
    let att = [];
    for (let a of this.attributes) {
      att.push(a.attribute_id.toString());
    }

    let data = {
      products_id: this.product.products_id.toString(),
      attributes: att
    };

    this.config.postHttp('getquantity', data).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        if (data.stock > 0) {
          this.cartButton = "addToCart"
        }
        else {
          this.cartButton = "outOfStock"
          this.shared.toast("Product Not Available With these Attributes!");
        }
        console.log(data.stock);

      }
    }, error => {
      this.loading.hide();
    });
  }
  openProductUrl() {
    this.loading.autoHide(2000);
    this.iab.create(this.product.products_url, "blank");
  }
  addToCartProduct() {
    this.loading.autoHide(500);
    // console.log(this.product);
    this.shared.addToCart(this.product, this.attributes);
    this.navCtrl.pop();
  }

  //============================================================================================  
  //function adding attibute into array
  fillAttributes = function (val, optionID) {

    //console.log(val);
    //  console.log(this.attributes);
    this.attributes.forEach((value, index) => {
      if (optionID == value.products_options_id) {
        value.products_options_values_id = val.id;
        value.options_values_price = val.price;
        value.price_prefix = val.price_prefix;
        value.attribute_id = val.products_attributes_id;
        value.products_options_values = val.value;
        value.name = val.value + ' ' + val.price_prefix + val.price + " " + this.config.currency
      }
    });
    console.log(this.attributes);
    //calculating total price 
    this.calculatingTotalPrice();
    this.checkAvailability();
  };
  //============================================================================================  
  //calculating total price  
  calculatingTotalPrice = function () {
    var price = parseFloat(this.product.products_price.toString());
    if (this.product.discount_price != null || this.product.discount_price != undefined)
      price = this.product.discount_price;
    var totalPrice = this.shared.calculateFinalPriceService(this.attributes) + parseFloat(price.toString());

    if (this.product.discount_price != null || this.product.discount_price != undefined)
      this.discount_price = totalPrice;
    else
      this.product_price = totalPrice;
    //  console.log(totalPrice);
  };

  checkProductNew() {
    var pDate = new Date(this.product.products_date_added);
    var date = pDate.getTime() + this.config.newProductDuration * 86400000;
    var todayDate = new Date().getTime();
    if (date > todayDate)
      return true;
    else
      return false
  }

  pDiscount() {
    var rtn = "";
    var p1 = parseInt(this.product.products_price);
    var p2 = parseInt(this.product.discount_price);
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { rtn = ""; }
    var result = Math.abs((p1 - p2) / p1 * 100);
    result = parseInt(result.toString());
    if (result == 0) { rtn = "" }
    rtn = result + '%';
    return rtn;
  }
  share() {
    this.loading.autoHide(1000);
    // Share via email
    this.socialSharing.share(
      "Hi... i fount some awesome product " + this.product.products_name+','+this.config.yourSiteUrl + '/'+this.product.products_image,'','',
     ' App link '+"https://play.google.com/store/apps/details?id=com.smartindia.grocery").then((res) => {
        // Success!
        console.log(JSON.stringify(res));
      }).catch((err) => {
        console.log(err);
        // Error!
      });



  }
  async clickWishList() {

    if (this.shared.customerData.customers_id == null || this.shared.customerData.customers_id == undefined) {
      let modal = await this.modalCtrl.create({
        component: LoginPage,
        componentProps: {
          'hideGuestLogin': true
        }
      });
      return await modal.present();
    }
    else {
      if (this.product.isLiked == '0') { this.addWishList(); }
      else this.removeWishList();
    }
  }
  addWishList() {
    this.shared.addWishList(this.product);
  }
  removeWishList() {
    this.shared.removeWishList(this.product);
  }
  ngOnInit() {

    if (this.product.flash_start_date) {
      if (this.product.server_time < this.product.flash_start_date) this.is_upcomming = true;
      console.log("server time less than " + (this.product.server_time - this.product.flash_start_date));
    }
  }




}
