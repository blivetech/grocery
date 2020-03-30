import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonContent, IonSlides, NavController, Events, ActionSheetController, MenuController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { LoadingService } from 'src/providers/loading/loading.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  scrollTopButton = false;
  products = new Array;
  selectedTab = '';
  categoryId = '';
  categoryName = '';
  sortOrder = 'newest';
  sortArray = ['Newest', 'A - Z', 'Z - A', 'Price : high - low', 'Price : low - high', 'Top Seller', 'Special Products', 'Most Liked'];
  page = 0;
  applyFilter = false;
  filters = [];
  selectedFilters = [];
  price = { lower: 0, upper: 500 };
  maxAmount = 500;
  side = "right";
  productView = 'grid';
  httpRunning = true;
  sliderConfig = {
    slidesPerView: "auto"
  }

  constructor(
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public config: ConfigService,
    public shared: SharedDataService,
    public loading: LoadingService,
    public events: Events,
    public actionSheet: ActionSheetController,
    public menuCtrl: MenuController
  ) {
    if (shared.dir == "rtl") this.side = "left";

    if (this.activatedRoute.snapshot.paramMap.get('id') != undefined) this.selectedTab = this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.activatedRoute.snapshot.paramMap.get('name') != undefined) this.categoryName = this.activatedRoute.snapshot.paramMap.get('name');
    if (this.activatedRoute.snapshot.paramMap.get('type') != undefined) this.sortOrder = this.activatedRoute.snapshot.paramMap.get('type');
    if (parseInt(this.selectedTab) == 0) { this.selectedTab = ''; }

    this.getProducts(null);
    this.getFilters(this.categoryId);
  }

  getProducts(infiniteScroll) {
    this.httpRunning = true;
    if (this.page == 0) { this.loading.show(); }
    var dat: { [k: string]: any } = {};
    if (this.shared.customerData != null)//in case user is logged in customer id will be send to the server to get user liked products
      dat.customers_id = this.shared.customerData.customers_id;
    if (this.applyFilter == true) {
      dat.filters = this.selectedFilters;
      dat.price = { minPrice: this.price.lower, maxPrice: this.price.upper };
    }
    dat.categories_id = this.selectedTab;
    dat.page_number = this.page;
    dat.type = this.sortOrder;
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp('getallproducts', dat).then((data: any) => {
      this.httpRunning = false;
      // console.log(data.product_data.length + "   " + this.page);
      this.infinite.complete();
      if (this.page == 0) { this.products = new Array; this.loading.hide(); this.scrollToTop(); }
      if (data.success == 1) {
        this.page++;
        var prod = data.product_data;
        for (let value of prod) {
          this.products.push(value);
        }
      }
      if (data.success == 1 && data.product_data.length == 0) { this.infinite.disabled = true; }
      if (data.success == 0) { this.infinite.disabled = true; }

    }, (error: any) => {
      this.httpRunning = false;
    });

  }

  //changing tab
  changeTab(c) {
    this.applyFilter = false;
    this.infinite.disabled = false;
    this.page = 0;
    if (c == '') this.selectedTab = c
    else this.selectedTab = c.id;
    this.getProducts(null);
    this.getFilters(this.selectedTab);
  }

  //============================================================================================  
  // filling filter array for keyword search 
  fillFilterArray(fValue, fName, keyword) {

    if (!fValue.target.checked == true) {
      this.selectedFilters.push({ 'name': fName, 'value': keyword });
    }
    else {
      this.selectedFilters.forEach((value, index) => {
        if (value.value == keyword) {
          this.selectedFilters.splice(index, 1);
        }
      });
    }
    //console.log(this.selectedFilters);
  };
  //============================================================================================  
  //getting countries from server
  getFilters(id) {
    var dat: { [k: string]: any } = {};
    dat.categories_id = id;
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp('getfilters', dat).then((data: any) => {
      //  console.log(data);
      if (data.success == 1)
        this.filters = data.filters;
      this.maxAmount = this.price.upper = data.maxPrice;
    });
  };
  applyFilters() {
    this.applyFilter = true;
    this.infinite.disabled = false;
    this.page = 0;
    this.getProducts(null);
    this.menuCtrl.close("menu2");
  }
  resetFilters() {
    this.getFilters(this.selectedTab);
    this.menuCtrl.close("menu2");
  }
  removeFilters() {
    this.applyFilter = false;
    this.infinite.disabled = false;
    this.page = 0;
    this.getProducts(null);
    this.getFilters(this.selectedTab);
  }
  ngOnChanges() {

  }

  getSortProducts(value) {

    if (value == 'Newest') value = 'newest';
    else if (value == 'A - Z') value = 'a to z';
    else if (value == 'Z - A') value = 'z to a';
    else if (value == 'Price : high - low') value = 'high to low';
    else if (value == 'low to high') value = 'low to high';
    else if (value == 'Top Seller') value = 'top seller';
    else if (value == 'Special Products') value = 'special';
    else if (value == 'Most Liked') value = 'most liked';
    else value = value;

    //console.log(value);
    if (value == this.sortOrder) return 0;
    else {
      this.sortOrder = value;
      this.infinite.disabled = false;
      this.page = 0;
      this.getProducts(null);
    }
  }

  async openSortBy() {
    var buttonArray = [];
    this.shared.translateArray(this.sortArray).then(async (res: any) => {

      for (let key in res) {
        buttonArray.push({ text: res[key], handler: () => { this.getSortProducts(key) } });
      }
      this.shared.translateString("Cancel").then(async (res: string) => {
        buttonArray.push(
          {
            text: res,
            role: 'cancel',
            handler: () => {
            }
          }
        );
      });
      var action = await this.actionSheet.create({
        buttons: buttonArray
      });
      await action.present();
    });
  }
  toggleMenu() {
    this.menuCtrl.toggle("menu2");
  }
  changeLayout() {
    if (this.productView == 'list') this.productView = "grid";
    else this.productView = "list";

    this.scrollToTop();
  }

  scrollToTop() {
    try {
      this.content.scrollToTop(700);
      this.scrollTopButton = false;
    } catch (error) {

    }

  }
  onScroll(e) {
    if (e.scrollTop >= 1200) this.scrollTopButton = true;
    if (e.scrollTop < 1200) this.scrollTopButton = false;
    //else this.scrollTopButton=false;
    //   console.log(e);
  }

  ionViewDidEnter() {
    try {
      setTimeout(() => {
        let ind = 0;
        this.shared.allCategories.forEach((value, index) => {
          if (this.selectedTab == value.id) { ind = index; }
        });
        this.slides.slideTo(ind, 1000, true);
      }, 100);
    } catch (error) {

    }
  }
  ngOnInit() {

  }
}
// data.attributes.forEach(element => {
//   let variable = { attribute_name: element.attribute_name, attribute_slug: element.attribute_slug };
//   let terms = [];
//   element.attribute_terms.forEach(v => {
//     this.checkAttributeSelected(element, v);
//     terms.push(Object.assign(v, { value: false }));
//   });

//   this.attributes.push(Object.assign(variable, { attribute_terms: terms }));
// });