import { Component, OnInit, ApplicationRef } from '@angular/core';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

import { ConfigService } from 'src/providers/config/config.service';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  search: any;
  products: any;
  showCategories = true;
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public http: HttpClient,
    public loading: LoadingService,
    public shared: SharedDataService) { }
  onChangeKeyword = function (e) {
    //console.log(this.search);
    // if (search != undefined) {
    //rchResult = [];
    //  }
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


  openProducts(id, name) {
    this.navCtrl.navigateForward(this.config.currentRoute + "/products/" + id + "/" + name + "/newest");
  }

  ngOnInit() {
  }

}
