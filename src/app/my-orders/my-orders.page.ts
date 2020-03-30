import { Component, OnInit, ViewChild, ApplicationRef } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;

  page = 1;
  orders = new Array;
  httpRunning = true;
  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public config: ConfigService,
    public shared: SharedDataService,

    public loading: LoadingService,
    private applicationRef: ApplicationRef
  ) {
  }

  refreshPage() {
    this.page = 1;
    this.infinite.disabled = false;
    this.getOrders();
  }
  addCurrecny(order, v2) {
    return order.currency + " " + v2;
  }

  ngOnInit() {
    this.httpRunning = true;
    this.getOrders();
  }

  getOrders() {
    this.httpRunning = true;
    this.orders = [];
    this.loading.show();
    var dat: { [k: string]: any } = {};
    dat.customers_id = this.shared.customerData.customers_id;
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    this.config.postHttp('getorders', dat).then((data: any) => {
      this.loading.hide();
      this.httpRunning = false;
      //$rootScope.address=response.data.data;
      if (data.success == 1) {
        this.orders = [];
        this.orders = data.data;
      }
      // $scope.$broadcast('scroll.refreshComplete');
    },
      function (response) {
        this.loading.hide();

        this.shared.toast("Server Error while Loading Orders");
        console.log(response);
      });
  };

  showOrderDetail(order) {

    this.shared.myOrderDetialPageData = order;
    this.navCtrl.navigateForward(this.config.currentRoute + "my-order-detail");

  }
  openProductsPage() {
    this.navCtrl.navigateForward("tabs/" + this.config.getCurrentHomePage());
  }

}
