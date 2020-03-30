import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, IonContent, IonSlides, IonInfiniteScroll } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-home7',
  templateUrl: './home7.page.html',
  styleUrls: ['./home7.page.scss'],
})
export class Home7Page implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('recentSlider', { static: false }) slider: IonSlides;
  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;
  segments = "topSeller"//first segment by default 
  scrollTopButton = false;//for scroll down fab 
  //for product slider after banner
  sliderConfig = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }



  products: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  page = 0;
  count = 0;
  loadingServerData = false;
  segments2 = "aboutUs";
  constructor(
    public nav: NavController,
    public config: ConfigService,
    public events: Events,
    public shared: SharedDataService,
  ) { }

  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }
  // For FAB Scroll
  onScroll(e) {
    if (e.detail.scrollTop >= 500) {
      this.scrollTopButton = true;
    }
    if (e.detail.scrollTop < 500) {
      this.scrollTopButton = false;
    }
  }
  // For Scroll To Top Content
  scrollToTop() {
    this.content.scrollToTop(700);
    this.scrollTopButton = false;
  }
  openProducts(value) {
    this.nav.navigateForward(this.config.currentRoute + "/products/0/0/" + value);
  }

  getProducts() {
    if (this.loadingServerData) return 0;
    if (this.page == 0) {
      this.count++;
      this.loadingServerData = false;
    }
    this.loadingServerData = true;

    let data: { [k: string]: any } = {};
    if (this.shared.customerData.customers_id != null)
      data.customers_id = this.shared.customerData.customers_id;
    data.page_number = this.page;
    data.language_id = this.config.langId;
    data.currency_code = this.config.currecnyCode;

    this.config.postHttp('getallproducts', data).then((data: any) => {
      let dat = data.product_data;
      this.infinite.complete();
      if (this.page == 0) {
        this.products = new Array;
      }
      if (dat.length != 0) {
        this.page++;
        for (let value of dat) {
          this.products.push(value);
        }
      }
      if (dat.length == 0) { this.infinite.disabled = true; }
      this.loadingServerData = false;

    });
  }
  ngOnInit() {
    this.getProducts();
  }
}
