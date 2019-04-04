import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { ProductModel } from 'src/app/modules/dashboard/pages/products/models/product.model';
import { UploadModel } from 'src/app/modules/dashboard/pages/products/models/upload.model';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { CURRENCY_MASK, NUMBER_MASK } from 'src/app/directives/currency-mask.directive';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss']
})
export class RegisterProductComponent implements OnInit, OnDestroy {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public numberMask = NUMBER_MASK;
  public showPricingPerDay = false;
  public baseValue = '0.00';
  public registerProductForm: FormGroup;
  public currentProduct: ProductModel;
  public selectedFiles: FileList;
  public currentUpload: UploadModel;
  public imgURL: any;
  public base64textString: any;
  public imagePath: any;
  public loading = false;
  private _subscriptionURL: Subscription;

  constructor(
    private _productService: ProductsService,
    private _snackBar: MatSnackBar,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.registerProductForm = new FormGroup({
      image: new FormControl(''),
      name: new FormControl('', [
        Validators.required,
      ]),
      sku: new FormControl('', [
        Validators.required,
      ]),
      brand: new FormControl('', [
        Validators.required,
      ]),
      unitsPackage: new FormControl('', [
        Validators.required,
      ]),
      category: new FormControl('', [
        Validators.required,
      ]),
      content: new FormControl('', [
        Validators.required,
      ]),
      retailPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      wholesalePrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      wholesaleQuantity: new FormControl(15, [
        Validators.required,
      ]),
      mondayPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      tuesdayPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      wednesdayPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      thursdayPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      fridayPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      saturdayPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      sundayPrice: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      sellerCommission: new FormControl(this.baseValue, [
        Validators.required,
      ]),
      isPricedPerDay: new FormControl()
    });
  }

  public registerProduct() {
    if (this.registerProductForm.valid) {
      this.loading = true; // Add this line
      this.savePhoto().then(
        response => {
          this.registerProductForm.get('image').patchValue(response);
          this._productService.registerProduct(this.registerProductForm.value);
          this.openSnackBar();
          this._router.navigate(['/dashboard/products']);
        }, error => console.error(error)
      );
    }
  }

  public handleFileSelect(event) {
    const files = event.target.files;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(file);
  }

  public _handleReaderLoaded(readerEvent) {
    const binaryString = readerEvent.target.result;
    this.base64textString = btoa(binaryString);
  }

  public savePhoto() {
    return new Promise((resolve, reject) => {
      this._productService.imageUpload(this.base64textString).then(
        response => {
          this._subscriptionURL = response.subscribe(
            url => resolve(url),
            error => console.error(error)
          );
        },
        error => reject(error)
      );
    });
  }

  public preview(files: any) {
    if (files.length === 0) {
      return;
    }
    const MIME_TYPE = files[0].type;
    if (MIME_TYPE.match(/image\/*/) == null) {
      // mat-error
      return;
    }
    const READER = new FileReader();
    this.imagePath = files;
    READER.readAsDataURL(files[0]);
    READER.onload = (_event) => {
      this.imgURL = READER.result;
    };
  }

  public openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: PRODUCTS_LANGUAGE.snackbarAdd
      }
    });
  }

  ngOnDestroy() {
    if (this._subscriptionURL) {
      this._subscriptionURL.unsubscribe();
    }
  }
}
