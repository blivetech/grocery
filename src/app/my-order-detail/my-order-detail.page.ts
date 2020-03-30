import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-my-order-detail',
  templateUrl: './my-order-detail.page.html',
  styleUrls: ['./my-order-detail.page.scss'],
})
export class MyOrderDetailPage implements OnInit {

  order: { [k: string]: any } = {};
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public shared: SharedDataService,
    public loading: LoadingService,
  ) {
    this.order = this.shared.myOrderDetialPageData;

  }
  getSingleProductDetail(id) {
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
        let p = data.product_data[0]
        this.shared.singleProductPageData.push(p);
        this.navCtrl.navigateForward(this.config.currentRoute + "product-detail/" + p.id);
      }
    });
  }
  ionViewDidLoad() {
    this.order = this.shared.myOrderDetialPageData;
  }

  ngOnInit() {
  }

}
