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
  selector: 'app-edit-promotion',
  templateUrl: './edit-promotion.component.html',
  styleUrls: ['./edit-promotion.component.scss']
})
export class EditPromotionComponent implements OnInit, OnDestroy {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public editPromotionForm: FormGroup;
  public minDate = new Date(2019, 0, 1);
  public maxDate = new Date(2025, 0, 1);
  public dataSource: any;
  public id: string;
  private _subscription: Subscription;
  private _subscriptionService: Subscription;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _productService: ProductsService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getProduct();
    this.editPromotionForm = new FormGroup({
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
          this.editPromotionForm.get('startDate').patchValue(res.start_date_promo);
          this.editPromotionForm.get('endDate').patchValue(res.end_date_promo);
          this.editPromotionForm.get('mondayPrice').patchValue(res.monday_price_promo);
          this.editPromotionForm.get('tuesdayPrice').patchValue(res.tuesday_price_promo);
          this.editPromotionForm.get('wednesdayPrice').patchValue(res.wednesday_price_promo);
          this.editPromotionForm.get('thursdayPrice').patchValue(res.thursday_price_promo);
          this.editPromotionForm.get('fridayPrice').patchValue(res.friday_price_promo);
          this.editPromotionForm.get('saturdayPrice').patchValue(res.saturday_price_promo);
          this.editPromotionForm.get('sundayPrice').patchValue(res.sunday_price_promo);
          this.editPromotionForm.get('wholesalePrice').patchValue(res.wholesale_price_promo);
        });
    });
  }

  public editPromotion() {
    if (this.editPromotionForm.valid) {
      // this.loading = true;
      this._productService.editPromotion(this.editPromotionForm.value, this.id);
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
        text: PRODUCTS_LANGUAGE.snackbarEdited
      }
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscriptionService) {
      this._subscriptionService.unsubscribe();
    }
  }
}
