import { Component } from '@angular/core';

import { Platform, NavController, Events, ModalController, MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LoadingService } from 'src/providers/loading/loading.service';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoginPage } from './modals/login/login.page';
import { SignUpPage } from './modals/sign-up/sign-up.page';
import { LanguagePage } from './modals/language/language.page';
import { CurrencyListPage } from './modals/currency-list/currency-list.page';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  rootPage: any;
  appPages = [];
  // For all pages
  a1 = [
    {
      name: 'Home',
      icon: 'home',
      url: 'home',
      img: 'assets/left-menu-icon/home.png',
      items: [
        { name: "1", url: '/home', },
        { name: "2", url: '/home2', },
        { name: "3", url: '/home3', },
        { name: "4", url: '/home4', },
        { name: "5", url: '/home5', },
        { name: "6", url: '/home6', },
        { name: "7", url: '/home7', },
        { name: "8", url: '/home8', },
        { name: "9", url: '/home9', },
        { name: "10", url: '/home10', }
      ],
      expanded: false
    },
    {
      name: 'Categories',
      icon: 'apps',
      url: 'categories/0/0',
      img: 'assets/left-menu-icon/category.png',
      items: [
        { name: "1", url: '/categories/0/0' },
        { name: "2", url: '/categories2/0/0' },
        { name: "3", url: '/categories3/0/0' },
        { name: "4", url: '/categories4/0/0' },
        { name: "5", url: '/categories5/0/0' },
        { name: "6", url: '/categories6/0/0' }
      ], expanded: false
    },
    {
      name: 'Shop',
      icon: 'cash',
      url: '/products/0/0/newest',
      img: 'assets/left-menu-icon/shop.png',
      items: [
        { name: "Newest", url: '/products/0/0/newest' },
        { name: "Top Seller", url: '/products/0/0/top seller' },
        { name: "Deals", url: '/products/0/0/special' },
        { name: "Most Liked", url: '/products/0/0/most liked' }
      ],
      expanded: false
    },
  ];
  a2 = [
    { name: 'Home', icon: 'home', url: 'home', img: 'assets/left-menu-icon/home.png' },
    { name: 'Categories', icon: 'apps', url: 'categories', img: 'assets/left-menu-icon/category.png' },
    {
      name: 'Shop', icon: 'cash', url: '/products', img: 'assets/left-menu-icon/shop.png',
      items: [
        { name: "Newest", url: '/products/0/0/newest' },
        { name: "Top Seller", url: '/products/0/0/top seller' },
        { name: "Deals", url: '/products/0/0/special' },
        { name: "Most Liked", url: '/products/0/0/most liked' }
      ],
      expanded: false
    }];
  a3 = [
    { name: 'My Wish List', icon: 'heart', img: 'assets/left-menu-icon/wishlist.png', url: '/wish-list', value: 'wishListPage' },
    { name: 'Contact Us', icon: 'call', img: 'assets/left-menu-icon/phone.png', url: '/contact-us', value: 'contactPage' },
    { name: 'About Us', icon: 'information-circle', img: 'assets/left-menu-icon/about.png', url: '/about-us', value: 'aboutUsPage' },
    { name: 'News', icon: 'paper', img: 'assets/left-menu-icon/news.png', url: '/news', value: 'newsPage' },
    { name: 'Intro', icon: 'logo-ionic', img: 'assets/left-menu-icon/intro.png', url: '/intro', value: 'introPage' },
    { name: 'Share', icon: 'share', img: 'assets/left-menu-icon/share.png', url: 'share', value: 'sharePage' },
    { name: 'Rate Us', icon: 'star-half', img: 'assets/left-menu-icon/rating.png', url: 'rateUs', value: 'ratePage' },
    { name: 'Settings', icon: 'settings', img: 'assets/left-menu-icon/setting.png', url: '/settings', value: 'settingsPage' }
  ];
  a4 = [
    { name: 'My Wish List', icon: 'heart', img: 'assets/left-menu-icon/wishlist.png', url: '/wish-list', value: 'wishListPage' },
    { name: 'Edit Profile', icon: 'lock', img: 'assets/left-menu-icon/locked.png', url: '/my-account', login: true, value: 'editPage' },
    { name: 'Address', icon: 'locate', img: 'assets/left-menu-icon/map.png', url: '/addresses', login: true, value: 'addressesPage' },
    { name: 'My Orders', icon: 'cart', img: 'assets/left-menu-icon/orders.png', url: '/my-orders', login: true, value: 'myOrdersPage' },
    { name: 'Contact Us', icon: 'call', img: 'assets/left-menu-icon/phone.png', url: '/contact-us', value: 'contactPage' },
    { name: 'About Us', icon: 'information-circle', img: 'assets/left-menu-icon/about.png', url: '/about-us', value: 'aboutUsPage' },
    { name: 'News', icon: 'paper', img: 'assets/left-menu-icon/news.png', url: '/news', value: 'newsPage' },
    { name: 'Intro', icon: 'logo-ionic', img: 'assets/left-menu-icon/intro.png', url: '/intro', value: 'introPage' },
    { name: 'Share', icon: 'share', img: 'assets/left-menu-icon/share.png', url: 'share', value: 'sharePage' },
    { name: 'Rate Us', icon: 'star-half', img: 'assets/left-menu-icon/rating.png', url: 'rateUs', value: 'ratePage' },
    { name: 'Settings', icon: 'settings', img: 'assets/left-menu-icon/setting.png', url: '/settings', value: 'settingsPage' }
  ];

  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router,
    private navCtrl: NavController,
    public modalCtrl: ModalController,
    public statusBar: StatusBar,
    public storage: Storage,
    public network: Network,
    public loading: LoadingService,
    private admobFree: AdMobFree,
    public events: Events,
    public plt: Platform,
    private appVersion: AppVersion,
    public iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private deeplinks: Deeplinks,
    public menuCtrl: MenuController,
  ) {

    this.plt.ready().then(() => {

      this.statusBar.styleDefault();

      this.doubleTapToExit();
    });
    let connectedToInternet = true;
    network.onDisconnect().subscribe(() => {
      connectedToInternet = false;
      this.shared.showAlertWithTitle("Please Connect to the Internet", "Disconnected");
    });

    network.onConnect().subscribe(() => {
      if (!connectedToInternet) {
        window.location.reload();
        this.shared.showAlertWithTitle("Network connected Reloading Data" + '...', "Connected");
      }
    });

    document.documentElement.dir = localStorage.direction;
    shared.dir = localStorage.direction;

    this.initializeApp();

    events.subscribe('showAd', () => {
      this.showInterstitial();
    });
    events.subscribe('openCategoryPage', (value) => {
      this.openCategoryPage();
    });
    events.subscribe('openHomePage', (value) => {
      this.openHomePage();
    });
    events.subscribe('openShippingAddressPage', () => {
      this.navCtrl.navigateForward("/tabs/cart/shipping-address");
    });
  }
  click() {
    console.log(this.shared.missingValues);
  }
  initializeApp() {
    this.plt.ready().then(() => {
      this.runAdmob();
      this.config.siteSetting().then((value) => {
        this.loadHomePage()
        this.getLeftItems();
        //subscribe for push notifiation
        this.storage.get('pushNotification').then((val) => {
          if (val == undefined) {
            this.shared.subscribePush();
            this.storage.set('pushNotification', "loaded");
          }
        });
      });
      this.statusBar.styleLightContent();

    });

  }

  // loading home page =========================================================================
  loadHomePage() {
    setTimeout(() => {
      if(localStorage.getItem('firstTime') != 'true'){
        this.navCtrl.navigateRoot("intro");
      }
    }, 500);
   
    this.storage.get('firsttimeApp').then((val) => {
      let value = val;

      if (value == 'firstTime') {
        this.openHomePage();
        this.config.checkingNewSettingsFromServer();
      }
      else {
        this.navCtrl.navigateRoot("intro");
      }
      this.storage.set('firsttimeApp', 'firstTime');
      localStorage.setItem('firstTime','true');
    });
  }
  doubleTapToExit() {
    // this.plt.registerBackButtonAction(() => {
    //   if (this.shared.currentOpenedModel != null) {
    //     this.shared.currentOpenedModel.dismiss();
    //     this.shared.currentOpenedModel = null;
    //   }
    //   else {
    //     let navig = this.nav;
    //     if (navig.canGoBack()) {
    //       navig.pop();
    //     }
    //     else {
    //       if (this.counter == 0) {
    //         this.counter++;
    //         this.shared.toast("Press Back to Exit");
    //         setTimeout(() => { this.counter = 0 }, 2500)
    //       } else {
    //         // console.log("exitapp");
    //         this.plt.exitApp();
    //       }
    //     }
    //   }
    // }, 0)

  }
  // starting admob =========================================================================
  runAdmob() {
    if (this.plt.is('ios')) {
      if (this.config.admobIos == 1) this.initializeAdmob(this.config.admobBanneridIos, this.config.admobIntidIos);
      this.config.admob = this.config.admobIos;
    } else if (this.plt.is('android')) {
      if (this.config.admob == 1) this.initializeAdmob(this.config.admobBannerid, this.config.admobIntid);
    }

  }
  // preparing admob =========================================================================
  initializeAdmob(bannerId, intId) {
    if (this.plt.is('cordova')) {
      const bannerConfig: AdMobFreeBannerConfig = {
        id: bannerId,
        isTesting: false,
        autoShow: true
      };
      this.admobFree.banner.config(bannerConfig);

      this.admobFree.banner.prepare()
        .then(() => {
          //alert("loaded" +bannerId);
          //this.admobFree.banner.show();
        })
        .catch(e => console.log(e));

      const interstitialConfig: AdMobFreeInterstitialConfig = {
        id: intId,
        isTesting: false,
        autoShow: false
      };
      this.admobFree.interstitial.config(interstitialConfig);
      this.admobFree.interstitial.prepare();
    }
  }
  //=========================================================================
  showInterstitial() {
    if (this.plt.is('cordova')) {
      this.admobFree.interstitial.show();
      //this.admobFree.interstitial.isReady().then(() => { });
      this.admobFree.interstitial.prepare();
    }
  }

  openHomePage() {
    if (this.config.homePage == 1) { this.navCtrl.navigateForward("/tabs/home"); }
    if (this.config.homePage == 2) { this.navCtrl.navigateForward("/tabs/home2"); }
    if (this.config.homePage == 3) { this.navCtrl.navigateForward("/tabs/home3"); }
    if (this.config.homePage == 4) { this.navCtrl.navigateForward("/tabs/home4"); }
    if (this.config.homePage == 5) { this.navCtrl.navigateForward("/tabs/home5"); }
    if (this.config.homePage == 6) this.navCtrl.navigateForward("/tabs/home6");
    if (this.config.homePage == 7) this.navCtrl.navigateForward("/tabs/home7");
    if (this.config.homePage == 8) this.navCtrl.navigateForward("/tabs/home8");
    if (this.config.homePage == 9) this.navCtrl.navigateForward("/tabs/home9");
    if (this.config.homePage == 10) this.navCtrl.navigateForward("/tabs/home10");
  }
  openCategoryPage() {
    if (this.config.categoryPage == 1) { this.navCtrl.navigateForward("categories/0/0"); }
    if (this.config.categoryPage == 2) { this.navCtrl.navigateForward("categories2/0/0"); }
    if (this.config.categoryPage == 3) { this.navCtrl.navigateForward("categories3/0/0"); }
    if (this.config.categoryPage == 4) { this.navCtrl.navigateForward("categories4/0/0"); }
    if (this.config.categoryPage == 5) { this.navCtrl.navigateForward("categories5/0/0"); }
    if (this.config.categoryPage == 6) { this.navCtrl.navigateForward("categories6/0/0"); }
  }
  openSubcategoryPage(parent) {
    let i = "/" + parent.id + "/" + parent.name;
    if (this.config.categoryPage == 1) { this.navCtrl.navigateForward("categories" + i); }
    if (this.config.categoryPage == 2) { this.navCtrl.navigateForward("categories2" + i); }
    if (this.config.categoryPage == 3) { this.navCtrl.navigateForward("categories3" + i); }
    if (this.config.categoryPage == 4) { this.navCtrl.navigateForward("categories4" + i); }
    if (this.config.categoryPage == 5) { this.navCtrl.navigateForward("categories5" + i); }
    if (this.config.categoryPage == 6) { this.navCtrl.navigateForward("categories6" + i); }
  }


  async openLoginPage() {
    let modal = await this.modalCtrl.create({
      component: LoginPage
    });
    return await modal.present();
  }
  async openSignUpPage() {
    let modal = await this.modalCtrl.create({
      component: SignUpPage,
    });
    return await modal.present();
  }
  logOut() {
    this.shared.logOut();
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
        "Nice Application",
        this.config.appName,
        "assets/logo_header.png",
        this.config.packgeName.toString()
      ).then(() => {
      }).catch(() => {

      });
    } else if (this.plt.is('android')) {

      this.appVersion.getPackageName().then((val) => {
        this.socialSharing.share(
          "Nice Application",
          this.config.appName,
          "assets/logo_header.png",
          "https://play.google.com/store/apps/details?id=" + val
        ).then(() => {

        }).catch(() => {
        });
      });
    }
  }
  async openLanguagePage() {
    let modal = await this.modalCtrl.create({
      component: LanguagePage,
    });
    return await modal.present();
  }
  async openCurrencyPage() {
    let modal = await this.modalCtrl.create({
      component: CurrencyListPage,
    });
    return await modal.present();
  }

  getStatusBarColor() {
    // let headerColor = $('#primary').css('color');
    // let rgb2 = headerColor;
    // rgb2 = headerColor.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    // this.shared.headerHexColor = (rgb2 && rgb2.length === 4) ? "#" +
    //   ("0" + parseInt(rgb2[1], 10).toString(16)).slice(-2) +
    //   ("0" + parseInt(rgb2[2], 10).toString(16)).slice(-2) +
    //   ("0" + parseInt(rgb2[3], 10).toString(16)).slice(-2) : headerColor;
    // console.log(this.shared.headerHexColor);

    // let color = $('#my').css('color');
    // let rgb = color;
    // rgb = color.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
    // let ret = (rgb && rgb.length === 4) ? "#" +
    //   ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    //   ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    //   ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : color;
    // console.log(ret);
    // this.statusBar.backgroundColorByHexString(ret);
  }



  //==============================================================
  //for
  expandItem(i) {
    if (i.expanded == false) i.expanded = true;
    else i.expanded = false;
  }
  showImg() {
    return !this.config.defaultIcons;
  }

  getLeftItems() {
    let tempArray = new Array;
    if (!this.config.appInProduction) {
      this.a1.forEach((v: any, index) => {
        tempArray.push(v);
      });
    } else {
      this.a2.forEach((v: any, index) => {
        tempArray.push(v);
      });

    }

    if (this.shared.customerData.customers_id == null) {
      this.a3.forEach((v: any, index) => {
        tempArray.push(v);
      });
    }
    else {
      this.a4.forEach((v: any, index) => {
        tempArray.push(v);
      });
    }

    tempArray.forEach((v: any, index) => {
      if (this.config.wishListPage == 0 && v.value == "wishListPage") { tempArray.splice(index, 1); }
      if (this.config.editProfilePage == 0 && v.value == "editPage") { tempArray.splice(index, 1); }
      if (this.config.contactUsPage == 0 && v.value == "contactPage") { tempArray.splice(index, 1); }
      if (this.config.aboutUsPage == 0 && v.value == "aboutUsPage") { tempArray.splice(index, 1); }
      if (this.config.newsPage == 0 && v.value == "newsPage") { tempArray.splice(index, 1); }
      if (this.config.introPage == 0 && v.value == "introPage") { tempArray.splice(index, 1); }
      if (this.config.shareApp == 0 && v.value == "sharePage") { tempArray.splice(index, 1); }
      if (this.config.rateApp == 0 && v.value == "ratePage") { tempArray.splice(index, 1); }
      if (this.config.settingPage == 0 && v.value == "settingsPage") { tempArray.splice(index, 1); }
      if (this.config.myOrdersPage == 0 && v.value == "myOrdersPage") { tempArray.splice(index, 1); }
    });
    this.appPages = tempArray;
    return tempArray;
  }
  getNameFirstLetter() {
    return this.shared.getNameFirstLetter();
  }
}
