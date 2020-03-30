import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { ModalController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  formData = {
    email: '',
  };
  errorMessage = '';
  constructor(
    public loading: LoadingService,
    public config: ConfigService,
    public shared: SharedDataService,
    public modalCtrl: ModalController, ) {
  }
  forgetPassword() {
    this.loading.show();
    this.errorMessage = '';
    this.config.postHttp(this.config.url + 'processforgotpassword', this.formData).then((data: any) => {
      this.loading.hide();
      if (data.success == 1) {
        this.shared.toast(data.message);
        this.dismiss();
      }
      if (data.success == 0) {
        this.errorMessage = data.message;
        this.shared.toast(data.message);
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}
