import { Component, OnInit, Input, ViewChild, ApplicationRef } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';


@Component({
  selector: 'app-sliding-tabs',
  templateUrl: './sliding-tabs.component.html',
  styleUrls: ['./sliding-tabs.component.scss'],
})
export class SlidingTabsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;

  @Input('type') type;//product data
  products = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  selected = 0;
  page = 0;
  httpRunning = true;
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public loading: LoadingService
  ) {

  }
  getProducts(infiniteScroll) {
    this.httpRunning = true;
    if (this.page == 0) {this.products = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; }
    let catId: any = this.selected;
    if (this.selected == 0) catId = '';
    var dat: { [k: string]: any } = {};
    dat.customers_id = null;
    dat.categories_id = this.selected;
    dat.page_number = this.page;

    // if (d.type != undefined)
    //   data.type = d.type;
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp('getallproducts', dat).then((data: any) => {
      this.httpRunning = false;

      this.infinite.complete();
      if (this.page == 0) {
        this.products = new Array;
        // this.loading.hide();
      }
      if (data.success == 1) {
        this.page++;
        var prod = data.product_data;
        for (let value of prod) {
          this.products.push(value);
        }
      }
      if (data.success == 0) { this.infinite.disabled = true; }
    });
    // console.log(this.products.length + "   " + this.page);
  }

  //changing tab
  changeTab(c) {
    this.infinite.disabled = false;
    this.page = 0;
    if (c == '0') this.selected = c
    else this.selected = c.id;
    this.getProducts(null);
    //this.loading.autoHide(700);
  }


  ngOnInit() {
    this.getProducts(null);
  }

}
