import { Pipe, PipeTransform } from '@angular/core';
import * as $ from "jquery";
@Pipe({
  name: 'curency'
})
export class CurencyPipe implements PipeTransform {

  constructor() {
  }

  transform(value) {


    let currency = localStorage.currency;
    let decimals = localStorage.decimals;
    let currecnyPos = localStorage.currencyPos;

    var priceFixed = parseFloat(value).toFixed(decimals);

    if (priceFixed.toString() == 'NaN') {

      if (currecnyPos == 'left')
        return currency + "" + value;
      else
        return value + " " + currency;
    }
    else {
      if (currecnyPos == 'left')
        return currency + "" + priceFixed;
      else
        return priceFixed + "" + currency;
    }
  }

}
