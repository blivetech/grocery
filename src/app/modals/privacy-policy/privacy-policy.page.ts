import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  constructor(
    public mdCtrl: ModalController,
    public shared: SharedDataService) {
    this.shared.currentOpenedModel = this;
  }

  ngOnInit() {
  }

  // For Modal Dismiss
  dismiss() {
    this.shared.currentOpenedModel = null;
    this.mdCtrl.dismiss();
  }
}
