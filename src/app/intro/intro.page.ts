import { Component, OnInit } from '@angular/core';
import { NavController, Events, LoadingController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {


  public slides = [
    { image: "assets/intro/intro_1.png", title: "Home Page", icon: "home", description: "" },
    { image: "assets/intro/intro_2.png", title: "Category Page", icon: "cart", description: "" },
    { image: "assets/intro/intro_3.png", title: "Shop Page", icon: "share", description: "" },
  
  ];
  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public config: ConfigService,
    public events: Events,
    public loadingController: LoadingController ) {
  }
  openHomePage() {
    this.presentLoading();
    this.events.publish("openHomePage");
    this.config.checkingNewSettingsFromServer();
  }
  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }
  ngOnInit() {
  }
 async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
}
