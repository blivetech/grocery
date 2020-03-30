import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';


@Component({
  selector: 'app-term-services',
  templateUrl: './term-services.page.html',
  styleUrls: ['./term-services.page.scss'],
})
export class TermServicesPage implements OnInit {

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
