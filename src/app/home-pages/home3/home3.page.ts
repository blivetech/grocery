import { Component, OnInit, ViewChild } from '@angular/core';
import { Events, IonSlides, AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/providers/loading/loading.service';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';


@Component({
  selector: 'app-home3',
  templateUrl: './home3.page.html',
  styleUrls: ['./home3.page.scss'],
})
export class Home3Page implements OnInit {
  getMyCity:any;
  sliderConfig = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }
  search: any;
  products: any;
  showCategories = true;
  constructor(
    public nav: NavController,
    public config: ConfigService,
    public events: Events,
    public http: HttpClient,
    public loading: LoadingService,
    public shared: SharedDataService,
    public route: Router,
    public navCtrl: NavController,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private appVersion : AppVersion
  ) { 
      
  }
  onChangeKeyword = function (e) {
    //console.log(this.search);
    // if (search != undefined) {
    //rchResult = [];
    //  }
  }

  openProducts(value) {
    this.nav.navigateForward(this.config.currentRoute + "/products/0/0/" + value);
  }
  ngOnInit() {
  }
  ionViewDidEnter() {

    
    this.getAppVersion();
    this.shared.hideSplashScreen();
    console.log(localStorage.getItem('getMyCity'))
    if(localStorage.getItem('getMyCity') == "" || localStorage.getItem('getMyCity')=== null){
      this.selectCityPrompt();
    }

  }

  /** for feature development get city name */

  // getLocation(value:string){
  //  console.log(value);
  //  if(value == 'gpsloc'){
  //    console.log('eeee');
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     // resp.coords.latitude
  //     // resp.coords.longitude
  //     let options: NativeGeocoderOptions = {
  //       useLocale: true,
  //       maxResults: 5
  //   };
  //   this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
  //     .then((result: NativeGeocoderResult[]) => {
  //       console.log(JSON.stringify(result[0]));
  //       localStorage.setItem('getMyCity',JSON.stringify(result[0]));
  //       this.getMyCity = JSON.stringify(result[0]);

  //       if(this.getMyCity != 'valsad'){
  //         this.shared.toast('We are not available in your city. When Smart India Grocery launches in your location you will get a notification.');
  //         this.showPromt();
  //       }
  //     })
  //     .catch((error: any) => console.log(error));
  //    }).catch((error) => {
  //      console.log('Error getting location', error);
  //    });
  //  }else if(value == 'apiloc'){
  //     this.selectCityPrompt();
  //  }
  // }

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


  productSearch(){
   // this.route.navigateByUrl("/search");
   this.navCtrl.navigateForward("/tabs/search");

  }

  // async showPromt(){
  //     const alert = await this.alertController.create({
  //       header: 'Select Location',
  //       inputs: [
        
  //         {
  //           name: 'radio',
  //           type: 'radio',
  //           label: 'Get Current Location',
  //           value: 'gpsloc'
  //         },
  //         {
  //           name: 'radio1',
  //           type: 'radio',
  //           label: 'Select Location',
  //           value: 'apiloc'
  //         }
  //       ],
  //       buttons: [
  //         {
  //           text: 'Cancel',
  //           role: 'cancel',
  //           cssClass: 'secondary',
  //           handler: () => {
  //             console.log('Confirm Cancel');
  //           }
  //         }, {
  //           text: 'Continue',
  //           handler: data => {
  //             this.getLocation(data);
              
  //           }
  //         }
  //       ]
  //     });
  
  //     await alert.present();
  //   }

    async selectCityPrompt(){
      const alert = await this.alertController.create({
        header: 'Choose City',
        inputs: [
        
          {
            name: 'radio',
            type: 'radio',
            label: 'Valsad',
            value: 'valsad'
          }
          
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Continue',
            handler: data => {
            //  this.getLocation(JSON.stringify(data));
            localStorage.setItem('getMyCity',data);
              this.getMyCity = data;
              this.ionViewDidEnter();
            }
          }
        ]
      });
  
      await alert.present();
    }

    getAppVersion(){
      this.appVersion.getVersionNumber().then(value => {
        console.log(value)
        this.checkappversion(value);
      }).catch(err => {
        alert(err);
      });
    }
    
    checkappversion(version){
      let varray:any = [];
       this.http.get('http://ambaji.sunfloweebiztech.com/appversion.php').subscribe((res)=>{
        console.log(JSON.stringify(res));
        varray = res;
        console.log('ee'+version);
        console.log('ee'+varray.version);
        if(version != varray.version){
          this.versioPrompt();
        }
      });
    }

 
  

  async versioPrompt(){
      const alert = await this.alertController.create({
        header: 'New update available',
        message: 'New version available in play store. please update',
        buttons: [ {
          text: 'UPDATE',
          role: 'update',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            window.open("https://play.google.com/store/apps/details?id=com.smartindia.grocery&hl=en","_system");
            this.ionViewDidEnter();
          }
        }],backdropDismiss:false
      });
  
      await alert.present();
    
  }

  }


