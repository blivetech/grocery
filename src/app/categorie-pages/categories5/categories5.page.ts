import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ConfigService } from 'src/providers/config/config.service';

@Component({
  selector: 'app-categories5',
  templateUrl: './categories5.page.html',
  styleUrls: ['./categories5.page.scss'],
})
export class Categories5Page implements OnInit {

  constructor(
    public shared: SharedDataService,
    public config: ConfigService,
    public router: Router) {
  }
  ngOnInit() {

  }
  viewAll(c) {
    this.router.navigateByUrl(this.config.currentRoute + "/products/" + c.id + "/" + c.name + "/newest");
  }

}

