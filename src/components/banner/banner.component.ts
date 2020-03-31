import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingService } from 'src/providers/loading/loading.service';

import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
  //  autoplay:true,
 //   speed: 2000,

   };
  constructor(
    public shared: SharedDataService,
    public navCtrl: NavController,
    public config: ConfigService,
    public http: HTTP,
    public loading: LoadingService,
  ) {

  }

  //===============================================================================================
  //on click image banners
  bannerClick = function (image) {
    if (image.type == 'category') {
      this.navCtrl.navigateForward("tabs/" + this.config.getCurrentHomePage() + "/products/" + image.url + "/0/newest");
    }
    else if (image.type == 'product') {
      this.getSingleProductDetail(parseInt(image.url));
    }
    else {
      this.navCtrl.navigateForward("tabs/" + this.config.getCurrentHomePage() + "/products/0/0/" + image.type);
    }
  }
  //===============================================================================================
  //getting single product data
  getSingleProductDetail(id) {
    this.loading.show();
    var dat: { [k: string]: any } = {};
    if (this.shared.customerData != null)
      dat.customers_id = this.shared.customerData.customers_id;
    else
      dat.customers_id = null;
    dat.products_id = id;
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp(this.config.url + 'getallproducts', dat).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.shared.singleProductPageData.push(data);
        this.navCtrl.navigateForward("tabs/" + this.config.getCurrentHomePage() + "/product-detail/" + data.products_id);
      }
    });
  }
  ngOnInit() { }
}
