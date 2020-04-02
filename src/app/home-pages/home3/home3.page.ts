import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, IonSlides } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/providers/loading/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home3',
  templateUrl: './home3.page.html',
  styleUrls: ['./home3.page.scss'],
})
export class Home3Page implements OnInit {
  sliderConfig = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }
  search: any;
  products: any;
  showCategories = true;
  constructor(
    public nav: NavController,
    public config: ConfigService,
    public events: Events,
    public http: HttpClient,
    public loading: LoadingService,
    public shared: SharedDataService,
    public route: Router,
    public navCtrl: NavController
  ) { 

  }
  onChangeKeyword = function (e) {
    //console.log(this.search);
    // if (search != undefined) {
    //rchResult = [];
    //  }
  }

  openProducts(value) {
    this.nav.navigateForward(this.config.currentRoute + "/products/0/0/" + value);
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }

  getSearchData = function () {

    if (this.search != undefined) {
      if (this.search == null || this.search == '') {
        this.shared.toast("Please enter something");
        return 0;
      }
    }
    else {
      this.shared.toast("Please enter something");
      return 0;
    }
    this.loading.show();
    this.config.postHttp('getsearchdata', { 'searchValue': this.search, 'language_id': this.config.langId, "currency_code": this.config.currecnyCode }).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.products = data.product_data.products;
        this.showCategories = false;
      }
      if (data.success == 0) {
        this.shared.toast(data.message);
      }
    });
  };


  productSearch(){
   // this.route.navigateByUrl("/search");
   this.navCtrl.navigateForward("/tabs/search");

  }

}
