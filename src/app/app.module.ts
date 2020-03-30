import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
// Providers Import
import { ConfigService } from '../providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// For Translation
import { HttpClientModule } from '@angular/common/http';
//for side menu expandable
import { MenuComponentComponent } from '../components/menu-component/menu-component.component';
import { Facebook } from '@ionic-native/facebook/ngx';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/pipes/pipes.module';
import { RefundPolicyPageModule } from './modals/refund-policy/refund-policy.module';
import { CurrencyListPageModule } from './modals/currency-list/currency-list.module';
import { LoginPageModule } from './modals/login/login.module';
import { SignUpPageModule } from './modals/sign-up/sign-up.module';
import { ForgotPasswordPageModule } from './modals/forgot-password/forgot-password.module';
import { PrivacyPolicyPageModule } from './modals/privacy-policy/privacy-policy.module';
import { SelectCountryPageModule } from './modals/select-country/select-country.module';
import { SelectZonesPageModule } from './modals/select-zones/select-zones.module';
import { TermServicesPageModule } from './modals/term-services/term-services.module';
import { LanguagePageModule } from './modals/language/language.module';
import { BlankModalPageModule } from './modals/blank-modal/blank-modal.module';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Md5 } from 'ts-md5/dist/md5';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Device } from '@ionic-native/device/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { EditAddressPageModule } from './modals/edit-address/edit-address.module';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponentComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    PipesModule,
    FormsModule,
    BlankModalPageModule,
    LanguagePageModule,
    RefundPolicyPageModule,
    CurrencyListPageModule,
    LoginPageModule,
    SignUpPageModule,
    ForgotPasswordPageModule,
    PrivacyPolicyPageModule,
    TermServicesPageModule,
    SelectCountryPageModule,
    SelectZonesPageModule,
    EditAddressPageModule
  ],
  providers: [
    StatusBar,
    ConfigService,
    SharedDataService,
    SplashScreen,
    AppVersion,
    SpinnerDialog,
    OneSignal,
    ThemeableBrowser,
    Geolocation,
    NativeGeocoder,
    SocialSharing,
    InAppBrowser,
    AdMobFree,
    Network,
    Deeplinks,
    HTTP,
    Facebook,
    EmailComposer,
    PhotoViewer,
    Md5,
    LocalNotifications,
    FCM,
    Device,
    GooglePlus,
    PayPal,
    Stripe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
