import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-scrolling-featured-products',
  templateUrl: './scrolling-featured-products.component.html',
  styleUrls: ['./scrolling-featured-products.component.scss'],
})
export class ScrollingFeaturedProductsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;
  // For products
  products: any = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  selected = '';
  page = 0;
  count = 0;
  loadingServerData = false;

  constructor(
    public config: ConfigService,
    public shared: SharedDataService, ) {
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
    data.type = 'most liked';

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
