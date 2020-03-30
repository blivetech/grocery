import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-categories6',
  templateUrl: './categories6.page.html',
  styleUrls: ['./categories6.page.scss'],
})
export class Categories6Page implements OnInit {

  categories = [];
  parent: { [k: string]: any } = {};
  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router,
    private activatedRoute: ActivatedRoute) {

    this.parent.id = this.activatedRoute.snapshot.paramMap.get('parent');
    this.parent.name = this.activatedRoute.snapshot.paramMap.get('name');

    if (this.parent.id == undefined) this.parent.id = 0;
    if (this.parent.name == undefined) this.parent.name = 0;
    if (this.parent.name == 0) this.parent.name = "Categories";
  }
  getCategories() {
    let cat = [];
    for (let value of this.shared.allCategories) {
      if (value.parent_id == this.parent.id) { cat.push(value); }
    }
    return cat;
  }
  openSubCategories(parent) {
    let count = 0;
    for (let value of this.shared.allCategories) {
      if (parent.id == value.parent_id) count++;
    }
    if (count != 0)
      this.router.navigateByUrl(this.config.currentRoute + "/categories6/" + parent.id + "/" + parent.name);
    else
      this.router.navigateByUrl(this.config.currentRoute + "/products/" + parent.id + "/" + parent.name + "/newest");
  }
  viewAll() {
    this.router.navigateByUrl(this.config.currentRoute + "/products/" + this.parent.id + "/" + this.parent.name + "/newest");
  }
  ngOnInit() {
  }
}


