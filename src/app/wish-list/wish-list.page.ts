import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonInfiniteScroll } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.page.html',
  styleUrls: ['./wish-list.page.scss'],
})
export class WishListPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;
  page = 0;
  httpRunning = false;
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public shared: SharedDataService,
    public storage: Storage) {

  }
  getProducts() {
    this.httpRunning = true;
    var dat: { [k: string]: any } = {};
    if (this.shared.customerData.customers_id != null)
      dat.customers_id = this.shared.customerData.customers_id;
    dat.page_number = this.page;
    dat.type = 'wishlist';
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp('getallproducts', dat).then((data: any) => {
      this.infinite.complete();
      this.httpRunning = false;
      if (data.success == 1) {
        this.page++;
        var prod = data.product_data;
        for (let value of prod) {
          this.shared.wishList.push(value);
        }
      }
      if (data.success == 0) { this.infinite.disabled = true; }
    });
  }
  ngOnInit() {
    this.getProducts();
    this.shared.wishList = [];
    this.page = 0;
  }


  openProductsPage() {
    this.navCtrl.navigateForward("tabs/" + this.config.getCurrentHomePage());
  }
}
