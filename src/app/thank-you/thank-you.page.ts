import { Component, OnInit } from '@angular/core';
import { NavController, Events, ToastController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.page.html',
  styleUrls: ['./thank-you.page.scss'],
})
export class ThankYouPage implements OnInit {


  constructor(
    public navCtrl: NavController,
    public shared: SharedDataService,
    public config: ConfigService,
    public events: Events,
    public toastController: ToastController
  ) {

    this.openHome();
  }
  openHome() {

      this.presentToast("Please wait... It automatically redirect to homepage.");
    setTimeout(() => {
   
      this.navCtrl.navigateRoot("tabs/cart", { replaceUrl: true });

    }, 2500);
  
  }
  openOrders() { this.navCtrl.navigateRoot("tabs/settings/my-orders"); }
  goBack() {
    this.navCtrl.navigateRoot("tabs/cart");
  }
  ngOnInit() {
  }

  
    async presentToast(message:string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    
  
  }
}
