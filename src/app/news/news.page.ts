import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonInfiniteScroll, NavController, Events } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';


@Component({
  selector: 'app-news',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  @ViewChild(IonInfiniteScroll, { static: false }) infinite: IonInfiniteScroll;
  featuredPosts = new Array;
  segments = 'newest';

  //WordPress intergation
  categories = new Array;
  //page varible
  page = 0;

  //WordPress intergation
  posts = new Array;
  //page varible
  page2 = 0;
  httpRunning = true;
  constructor(
    public navCtrl: NavController,
    public config: ConfigService,
    public loading: LoadingService,
    public shared: SharedDataService,
    public events: Events) {


    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    dat.is_feature = 1;
    this.config.postHttp('getallnews', dat).then((data: any) => {
      this.featuredPosts = data.news_data;
    });

    this.getPosts();
    this.getCategories();

  }
  //========================================= tab newest categories ===============================================================================

  getCategories = function () {

    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    dat.page_number = this.page2;
    this.config.postHttp('allnewscategories', dat).then((data: any) => {

      if (this.page2 == 0) { this.categories = []; }
      if (data.success == 1) {
        this.page2++;
        data.data.forEach((value, index) => {
          this.categories.push(value);
        });
        // console.log(data.data.length);
        this.getCategories();
      }
      if (data.data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled

        if (this.categories.length != 0) {
          //this.shared.toast('All Categories Loaded!');
        }
      }
    }, function (response) {
      // console.log("Error while loading categories from the server");
      // console.log(response);
    });
  };

  //============================================================================================  
  //getting list of posts
  getPosts() {
    this.httpRunning = true;
    var dat: { [k: string]: any } = {};
    dat.language_id = this.config.langId;
    dat.currency_code = this.config.currecnyCode;
    dat.page_number = this.page;
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
          // this.shared.toast('All Posts Loaded!');
        }
      }
    }, function (response) {
      // console.log("Error while loading posts from the server");
      // console.log(response);
    });
  };

  //============================================================================================  
  //getting list of sub categories from the server
  showPostDetail(post) {

    this.shared.singlePostData = post;
    console.log(this.shared.singlePostData);
    this.navCtrl.navigateForward(this.config.currentRoute + "/news-detail");
  };
  openPostsPage(name, id) {
    this.navCtrl.navigateForward(this.config.currentRoute + "/news-list/" + id + "/" + name);
  }

  ngOnInit() {
  }

}
