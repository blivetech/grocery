import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-home10',
  templateUrl: './home10.page.html',
  styleUrls: ['./home10.page.scss'],
})
export class Home10Page implements OnInit {
  segments = "sale"//first segment by default 
  //for product slider after banner
  sliderConfig = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }

  constructor(
    public nav: NavController,
    public config: ConfigService,
    public events: Events,
    public shared: SharedDataService,
  ) { }
  openCategoryPage() {
    this.nav.navigateForward(this.config.currentRoute + "/" + this.config.getCurrentCategoriesPage() + "/0/0");
  }
  openProducts(value) {
    this.nav.navigateForward(this.config.currentRoute + "/products/0/0/" + value);
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }

}
