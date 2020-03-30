import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {


  public languages: any;
  selectedLanguage;
  translate;
  prviousLanguageId;
  constructor(
    public loading: LoadingService,
    public modalCont: ModalController,
    public config: ConfigService,
    public shared: SharedDataService) {

    this.prviousLanguageId = localStorage.langId;
    //getting all languages
    this.loading.show();
    this.config.getHttp('getlanguages').then((data: any) => {
      this.loading.hide();
      this.languages = data.languages;
      for (let data of this.languages) {
        if (data.languages_id == this.prviousLanguageId) {
          this.selectedLanguage = data;
        }
      }
    });
  }

  updateLanguage(lang) {

    if (lang != undefined && this.prviousLanguageId != lang.languages_id) {
      this.loading.show();
      localStorage.langId = lang.languages_id;
      localStorage.direction = lang.direction;
      this.shared.emptyCart();
      this.shared.emptyRecentViewed();
      setTimeout(() => {
        window.location.reload();
      }, 900);

    }
  }
  //close modal
  dismiss() {
    this.modalCont.dismiss();
  }

  ngOnInit() {
  }

}
