import { Component } from '@angular/core';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public homePath = "./home-pages/home/home.module#HomePageModule"
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public navCtrl: NavController, ) {

  }

  showImg() {
    if (this.config.defaultIcons == true) return false;
    else return true;
  }
  ionChange(appTabs) {
    this.config.currentRoute = "tabs/" + appTabs.getSelected();
    //console.log(this.config.currentRoute);
    if (this.shared.customerData.customers_id == null && this.config.currentRoute == 'tabs/cart') {
      this.navCtrl.navigateForward("/tabs/cart");
    }
  }

}
