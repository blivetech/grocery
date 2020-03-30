import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-news-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './news-list.page.html',
  styleUrls: ['./news-list.page.scss'],
})
export class NewsListPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;
  name;
  id;
  page = 0;
  posts = new Array;
  httpRunning = true;
  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    public shared: SharedDataService,
    public config: ConfigService,
    public loading: LoadingService,
    private activatedRoute: ActivatedRoute) {

    this.name = this.activatedRoute.snapshot.paramMap.get('name');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPosts();
  }
  showPostDetail(post) {
    this.shared.singlePostData = post;
    this.navCtrl.navigateForward(this.config.currentRoute + "/news-detail");
  };
  //============================================================================================  
  //getting list of posts
  getPosts() {
    this.httpRunning = true;
    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    dat.page_number = this.page;
    dat.categories_id = this.id;
    this.config.postHttp('getallnews', dat).then((data: any) => {
      this.httpRunning = false;
      this.infinite.complete();//stopping infinite scroll loader
      if (this.page == 0) {
        this.posts = []; this.infinite.disabled == false;
      }
      if (data.success == 1) {
        this.page++;
        data.news_data.forEach((value, index) => {
          this.posts.push(value);
        });
      }
      if (data.news_data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled

        //disabling infinite scroll
        this.infinite.disabled == true;
        if (this.posts.length != 0) {

        }
      }
    }, function (response) {
      // console.log("Error while loading posts from the server");
      // console.log(response);
    });
  };

  ngOnInit() {
  }

}
