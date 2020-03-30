import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { ModalController, NavController, Events, NavParams } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { SignUpPage } from '../sign-up/sign-up.page';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { LoadingService } from 'src/providers/loading/loading.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formData = { email: '', password: '' };
  errorMessage = '';
  hideGuestLogin: true;
  constructor(

    public config: ConfigService,
    public modalCtrl: ModalController,
    public loading: LoadingService,
    public shared: SharedDataService,
    private fb: Facebook,
    private applicationRef: ApplicationRef,
    public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    private googlePlus: GooglePlus
  ) {
    this.hideGuestLogin = navParams.get('hideGuestLogin');
    this.shared.currentOpenedModel = this;
  }

  login() {
    this.loading.show();
    this.errorMessage = '';
    this.config.postHttp('processlogin', this.formData).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        this.dismiss();
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
      }
    });
  }
  async openSignUpPage() {
    this.dismiss();
    const modal = await this.modalCtrl.create({
      component: SignUpPage
    });
    return await modal.present();
  }
  async openForgetPasswordPage() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordPage
    });
    return await modal.present();
  }

  facebookLogin() {
    this.fb.getLoginStatus().then((res: any) => {
      if (res.status == 'connected') {
        console.log("user connected already" + res.authResponse.accessToken);
        this.createAccount(res.authResponse.accessToken, 'fb');

      }
      else {
        console.log("USer Not login ");
        this.fb.login(['public_profile', 'email'])
          .then((res: FacebookLoginResponse) => {
            // this.alert.show('Logged into Facebook!' + JSON.stringify(res));
            console.log("successfully login ");
            this.createAccount(res.authResponse.accessToken, 'fb');
          })
          .catch(e => this.shared.showAlert('Error logging into Facebook' + JSON.stringify(e)));
      }
    }).catch(e => this.shared.showAlert('Error Check Login Status Facebook' + JSON.stringify(e)));
  }

  googleLogin() {
    this.loading.autoHide(500);
    this.googlePlus.login({})
      .then(res => {
        //  alert(JSON.stringify(res))
        this.createAccount(res, 'google');
      })
      .catch(err => this.shared.showAlert(JSON.stringify(err)));
  }
  //============================================================================================  
  //creating new account using function facebook or google details 
  createAccount(info, type) {
    // alert(info);
    this.loading.show();
    var dat: { [k: string]: any } = {};
    var url = '';
    if (type == 'fb') {
      url = 'facebookregistration';
      dat.access_token = info;
    }
    else {
      url = 'googleregistration';
      dat = info;
    }
    this.config.postHttp(url, dat).then((data: any) => {
      this.loading.hide();
      // alert("data get");
      if (data.success == 1) {
        this.shared.login(data.data[0]);
        //alert('login');
        this.shared.showAlertWithTitle("<h3>Your Account has been created successfully !</h3><ul><li>Your Email: "
          + "<span>" + this.shared.customerData.email + "</span>" + "</li><li>Your Password: "
          + "<span>" + this.shared.customerData.password + "</span>" +
          " </li></ul><p>You can login using this Email and Password.<br>You can change your password in Menu -> My Account</p>", "Account Information");
        //  $ionicSideMenuDelegate.toggleLeft();
        this.dismiss();

      }
      else if (data.success == 2) {
        //  alert("login with alreday");
        this.dismiss();
        this.shared.login(data.data[0]);
      }

    }, error => {
      this.loading.hide();
      this.shared.showAlert("error " + JSON.stringify(error));
      // console.log("error " + JSON.stringify(error));
    });
  };
  //close modal
  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

  guestLogin() {
    this.shared.orderDetails.guest_status = 1;
    this.events.publish('openShippingAddressPage');
    this.dismiss();
  }

}
