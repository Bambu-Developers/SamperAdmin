import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';

@Component({
  selector: 'app-register-promotion',
  templateUrl: './register-promotion.component.html',
  styleUrls: ['./register-promotion.component.scss']
})
export class RegisterPromotionComponent implements OnInit {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public registerPromotionForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.registerPromotionForm = new FormGroup({});
  }

}
