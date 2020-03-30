import { Component, OnInit } from '@angular/core';
import { ModalController, Events, Platform, NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../modals/login/login.page';
import { PrivacyPolicyPage } from '../modals/privacy-policy/privacy-policy.page';
import { TermServicesPage } from '../modals/term-services/term-services.page';
import { RefundPolicyPage } from '../modals/refund-policy/refund-policy.page';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LanguagePage } from '../modals/language/language.page';
import { CurrencyListPage } from '../modals/currency-list/currency-list.page';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  setting: { [k: string]: any } = {};
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public config: ConfigService,
    private storage: Storage,
    public loading: LoadingService,
    public events: Events,
    public shared: SharedDataService,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    public plt: Platform,
    private appVersion: AppVersion,
    private oneSignal: OneSignal,
    public localNotifications: LocalNotifications
  ) {

  }
  ionViewDidEnter() {
  }
  turnOnOffNotification(value) {
    if (this.setting.localNotification == false) {
      this.localNotifications.cancel(1).then((result) => {
      });
    }
    else {
      this.localNotifications.schedule({
        id: 1,
        title: this.config.notifTitle,
        text: this.config.notifText,
        every: this.config.notifDuration,
      });
    }

    this.updateSetting();
  }

  updateSetting() {
    console.log(this.setting);
    this.storage.set('setting', this.setting);
  }
  async openLoginPage() {
    let modal = await this.modalCtrl.create({
      component: LoginPage,
      componentProps: {
        'hideGuestLogin': true
      }
    });
    return await modal.present();
  }
  async openCurrencyPage() {
    let modal = await this.modalCtrl.create({
      component: CurrencyListPage,
    });
    return await modal.present();
  }
  logOut() {
    this.shared.logOut();
  }
  openAccountPage() {
    this.navCtrl.navigateRoot("my-account");
  }
  openSite() {
    this.loading.autoHide(2000);
    this.iab.create(this.config.siteUrl, "blank");
  }
  //============================================================================================
  //turning on off local  notification
  onOffPushNotification() {
    this.storage.get('registrationId').then((registrationId) => {
      var dat: { [k: string]: any } = {};
      dat.device_id = registrationId;
      if (this.setting.notification == false) dat.is_notify = 0;
      else dat.is_notify = 1;
      this.config.postHttp('notify_me', dat).then((data: any) => {
        if (data.success == 1) {

          this.updateSetting();
        }
      }, function (response) {
        console.log(response);
      });
    });
  };
  hideShowFooterMenu() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }
  hideShowCartButton() {
    this.events.publish('setting', this.setting);
    this.updateSetting();
  }
  async showModal(value) {
    if (value == 'language') {
      let modal = await this.modalCtrl.create({
        component: LanguagePage
      });
      return await modal.present();
    }
    else if (value == 'privacyPolicy') {
      let modal = await this.modalCtrl.create({
        component: PrivacyPolicyPage
      });
      return await modal.present();
    }
    else if (value == 'termServices') {
      let modal = await this.modalCtrl.create({
        component: TermServicesPage
      });
      return await modal.present();
    }
    else {
      let modal = await this.modalCtrl.create({
        component: RefundPolicyPage
      });
      return await modal.present();
    }
  }
  ionViewDidLoad() {
    this.storage.get('setting').then((val) => {
      if (val != null || val != undefined) {
        this.setting = val;

      }
      else {
        this.setting.localNotification = true;
        this.setting.notification = true;
        this.setting.cartButton = true;
        this.setting.footer = true;
      }
    });
  }



  getNameFirstLetter() {
    return this.shared.getNameFirstLetter();
  }

  rateUs() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.iab.create(this.config.packgeName.toString(), "_system");
    } else if (this.plt.is('android')) {
      this.appVersion.getPackageName().then((val) => {
        this.iab.create("https://play.google.com/store/apps/details?id=" + val, "_system");
      });
    }
  }
  share() {
    this.loading.autoHide(2000);
    if (this.plt.is('ios')) {
      this.socialSharing.share(
        this.config.packgeName.toString(),
        this.config.appName,
        this.config.packgeName.toString(),
        this.config.packgeName.toString()
      ).then(() => {
      }).catch(() => {

      });
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          this.config.appName,
          this.config.appName,
          "",
          "https://play.google.com/store/apps/details?id=" + val
        ).then(() => {

        }).catch(() => {
        });
      });
    }
  }
  showAd() {
    this.loading.autoHide(2000);
    this.events.publish('showAd');
  }
  showOption(value) {
    if (this.config.wishListPage && value == "wishListPage" && this.shared.customerData.customers_id != null) { return true; }
    else if (this.config.editProfilePage && value == "editPage" && this.shared.customerData.customers_id != null) { return true; }
    else if (value == "address" && this.shared.customerData.customers_id != null) { return true; }
    else if (this.config.myOrdersPage && value == "myOrdersPage" && this.shared.customerData.customers_id != null) { return true; }
    else if (this.config.contactUsPage && value == "contactPage") { return true; }
    else if (this.config.aboutUsPage && value == "aboutUsPage") { return true; }
    else if (this.config.newsPage && value == "newsPage") { return true; }
    else if (this.config.introPage && value == "introPage") { return true; }
    else if (this.config.shareApp && value == "sharePage") { return true; }
    else if (this.config.rateApp && value == "ratePage") { return true; }
    else if (this.config.settingPage && value == "settingsPage") { return true; }
    else return false;
  }
  openPage(value) {
    this.navCtrl.navigateForward("tabs/settings/" + value);
  }
  ngOnInit() {
  }

}
