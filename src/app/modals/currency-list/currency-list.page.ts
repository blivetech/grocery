import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/providers/loading/loading.service';
import { ConfigService } from 'src/providers/config/config.service';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.page.html',
  styleUrls: ['./currency-list.page.scss'],
})
export class CurrencyListPage implements OnInit {

  currency: any;
  currencyList = [];
  currentCurrencySymbol = localStorage.currency;
  constructor(

    public loading: LoadingService,
    public config: ConfigService,
    public shared: SharedDataService,
    public modalCtrl: ModalController,
    public http: HttpClient) {
    this.getListOfCurrency();
  }
  getListOfCurrency() {
    this.loading.show();
    this.config.getHttp('getcurrencies').then((data: any) => {
      this.loading.hide();
      this.currencyList = data.data;
      this.currencyList.forEach(val => {
        if (localStorage.currencyCode == val.code)
          this.currency = val;
      });
    });
  }
  updateCurrency() {
    if (this.currency == undefined) return;
    
    console.log(localStorage.currencyCode + "  " + this.currency.code);
    if (localStorage.currencyCode != this.currency.code) {
      this.loading.autoHide(1000);

      localStorage.currencyCode = this.currency.code;
      if (this.currency.symbol_left != null) {
        localStorage.currencyPos = "left";
        localStorage.currency = this.currency.symbol_left;
      }
      else {
        localStorage.currencyPos = "right";
        localStorage.currency = this.currency.symbol_right;
      }

      localStorage.decimals = this.currency.decimal_places;
      this.shared.emptyCart();
      this.shared.emptyRecentViewed();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  //close modal
  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}
