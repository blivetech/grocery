import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.page.html',
  styleUrls: ['./refund-policy.page.scss'],
})
export class RefundPolicyPage implements OnInit {


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
