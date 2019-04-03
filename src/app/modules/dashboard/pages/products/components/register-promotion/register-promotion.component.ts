import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { CURRENCY_MASK } from 'src/app/directives/currency-mask.directive';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register-promotion',
  templateUrl: './register-promotion.component.html',
  styleUrls: ['./register-promotion.component.scss']
})
export class RegisterPromotionComponent implements OnInit {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public registerPromotionForm: FormGroup;
  public minDate = new Date(2019, 0, 1);
  public maxDate = new Date(2025, 0, 1);
  private _subscription: Subscription;
  public dataSource: any;
  public id: string;
  public _subscriptionService: Subscription;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _productService: ProductsService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getProduct();
    this.registerPromotionForm = new FormGroup({
      startDate: new FormControl(new Date, [
        Validators.required
      ]),
      endDate: new FormControl(new Date, [
        Validators.required
      ]),
      mondayPrice: new FormControl('', [
        Validators.required
      ]),
      tuesdayPrice: new FormControl('', [
        Validators.required
      ]),
      wednesdayPrice: new FormControl('', [
        Validators.required
      ]),
      thursdayPrice: new FormControl('', [
        Validators.required
      ]),
      fridayPrice: new FormControl('', [
        Validators.required
      ]),
      saturdayPrice: new FormControl('', [
        Validators.required
      ]),
      sundayPrice: new FormControl('', [
        Validators.required
      ]),
      wholesalePrice: new FormControl('', [
        Validators.required
      ])
    });
  }

  public getProduct() {
    this._subscription = this._route.params.subscribe(params => {
      this.id = params['id'];
      this._subscriptionService = this._productService.getProduct(this.id).subscribe(
        res => {
          this.dataSource = res;
        });
    });
  }

  public registerPromotion() {
    if (this.registerPromotionForm.valid) {
      this._productService.registerPromotion(this.registerPromotionForm.value, this.id);
      this.openSnackBar();
      this._router.navigate(['/dashboard/products/view/' +  this.id]);
    }
  }

  public openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: PRODUCTS_LANGUAGE.snackbarAddPromotion
      }
    });
  }

  OnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscriptionService) {
      this._subscriptionService.unsubscribe();
    }
  }
}
