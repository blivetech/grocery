import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  myAccountData = {
    customers_firstname: '',
    customers_lastname: '',
    phone: '',
    currentPassword: '',
    password: '',
    customers_dob: '',
    customers_id: '',
    image_id: 0,
    customers_telephone: ""
  };


  constructor(
    public config: ConfigService,
    public shared: SharedDataService,
    public loading: LoadingService) {
  }

  //============================================================================================  
  //function updating user information
  updateInfo() {
    console.log(this.shared.customerData);
    if (this.myAccountData.currentPassword == "" && this.myAccountData.password != "") {
      this.shared.toast("Please Enter Your New Password!");
      return;
    }
    else if (this.myAccountData.currentPassword != "" && this.myAccountData.password == "") {
      this.shared.toast("Please Enter Your Current Password!");
      return;
    }
    if (this.myAccountData.currentPassword != "" && this.myAccountData.password != "") {
      if (this.shared.customerData.password != this.myAccountData.currentPassword) {
        console.log(this.shared.customerData.password +"  "+ this.myAccountData.currentPassword);
        this.shared.toast("Current Password is Wrong!");
        return;
      }
    }

    this.loading.show();
    this.myAccountData.customers_id = this.shared.customerData.customers_id;
    var dat = this.myAccountData;
    //  console.log("post data  "+JSON.stringify(data));
    this.config.postHttp('updatecustomerinfo', dat).then((data: any) => {

      this.loading.hide();
      if (data.success == 1) {
        //   document.getElementById("updateForm").reset();
        let d = data.data[0];
        this.shared.toast(data.message);
        // if (this.myAccountData.password != '')
        //   this.shared.customerData.password = this.myAccountData.password;
        console.log("data from server");
        console.log(d);
        this.shared.login(d);
        this.myAccountData.currentPassword = "";
        this.myAccountData.password = "";
      }
      else {
        this.shared.toast(data.message);
      }
    }
      , error => {
        this.loading.hide();
        this.shared.toast("Error while Updating!");
      });
    //}
  }

  //============================================================================================

  ionViewWillEnter() {
    this.myAccountData.customers_firstname = this.shared.customerData.customers_firstname;
    this.myAccountData.customers_lastname = this.shared.customerData.customers_lastname;
    this.myAccountData.phone = this.shared.customerData.phone;
    //this.myAccountData.password = this.shared.customerData.password;
    try {
      // console.log(this.shared.customerData.customers_dob);
      this.myAccountData.customers_dob = new Date(this.shared.customerData.customers_dob).toISOString();
      // console.log(this.myAccountData.customers_dob);
    } catch (error) {
      this.myAccountData.customers_dob = new Date("1-1-2000").toISOString();
    }

  }

  ngOnInit() {
  }

}
