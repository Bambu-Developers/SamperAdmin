import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';
import { CURRENCY_MASK, NUMBER_MASK } from 'src/app/directives/currency-mask.directive';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit, OnDestroy {

  public editProductForm: FormGroup;
  public dataSource: any;
  public id: string;
  public base64textString: any;
  public imgURL: any;
  public imagePath: any;
  private _subscription: Subscription;
  private _subscriptionURL: Subscription;
  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public numberMask = NUMBER_MASK;
  public showPricingPerDay = true;
  public imgChanged = false;
  public loading = false;

  constructor(
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _productService: ProductsService
  ) { }

  ngOnInit() {
    this.getProduct();
    this.editProductForm = new FormGroup({
      image: new FormControl(),
      name: new FormControl('', [
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
      retailPrice: new FormControl('', [
        Validators.required,
      ]),
      wholesalePrice: new FormControl('', [
        Validators.required,
      ]),
      wholesaleQuantity: new FormControl('', [
        Validators.required,
      ]),
      mondayPrice: new FormControl('', [
        Validators.required,
      ]),
      tuesdayPrice: new FormControl('', [
        Validators.required,
      ]),
      wednesdayPrice: new FormControl('', [
        Validators.required,
      ]),
      thursdayPrice: new FormControl('', [
        Validators.required,
      ]),
      fridayPrice: new FormControl('', [
        Validators.required,
      ]),
      saturdayPrice: new FormControl('', [
        Validators.required,
      ]),
      sundayPrice: new FormControl('', [
        Validators.required,
      ]),
      sellerCommission: new FormControl('', [
        Validators.required,
      ])
    });
  }

  public getProduct() {
    this._subscription = this._route.params.subscribe(params  => {
      this.id = params['id'];
      this._productService.getProduct(this.id).subscribe(
        res => {
          this.dataSource = res;
          this.editProductForm.get('image').patchValue(res.img_preview_url);
          this.editProductForm.get('name').patchValue(res.name);
          this.editProductForm.get('brand').patchValue(res.brand);
          this.editProductForm.get('unitsPackage').patchValue(res.units_package);
          this.editProductForm.get('category').patchValue(res.category);
          this.editProductForm.get('content').patchValue(res.content);
          this.editProductForm.get('retailPrice').patchValue(res.retail_price);
          this.editProductForm.get('wholesalePrice').patchValue(res.wholesale_price);
          this.editProductForm.get('wholesaleQuantity').patchValue(res.wholesale_quantity);
          this.editProductForm.get('mondayPrice').patchValue(res.monday_price);
          this.editProductForm.get('tuesdayPrice').patchValue(res.tuesday_price);
          this.editProductForm.get('wednesdayPrice').patchValue(res.wednesday_price);
          this.editProductForm.get('thursdayPrice').patchValue(res.thursday_price);
          this.editProductForm.get('fridayPrice').patchValue(res.friday_price);
          this.editProductForm.get('saturdayPrice').patchValue(res.saturday_price);
          this.editProductForm.get('sundayPrice').patchValue(res.sunday_price);
          this.editProductForm.get('sellerCommission').patchValue(res.seller_commission);
        });
    });
  }

  public editProduct() {
    if (this.editProductForm.valid) {
      this.loading = true; // Add this line
      if (this.imgChanged) {
        this.savePhoto().then(
          response => {
            this.editProductForm.get('image').patchValue(response);
            this._productService.editProduct( this.editProductForm.value, this.id );
            this.openSnackBar();
          }, error => console.error(error)
        );
      } else {
        this._productService.editProduct( this.editProductForm.value, this.id);
        this.openSnackBar();
      }
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

  public preview( files ) {
    if ( files.length === 0 ) {
      return;
    }
    const MIME_TYPE = files[0].type;
    if (MIME_TYPE.match( /image\/*/ ) == null) {
      // mat-error
      return;
    }
    const READER = new FileReader();
    this.imagePath = files;
    READER.readAsDataURL( files[0] );
    READER.onload = ( _event ) => {
      this.imgURL = READER.result;
    };
    this.imgChanged = true;
  }

  public savePhoto() {
    return new Promise((resolve, reject) => {
      this._productService.imageUpload( this.base64textString ).then(
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
    if ( this._subscription ) {
      this._subscription.unsubscribe();
    }
    if ( this._subscriptionURL ) {
      this._subscriptionURL.unsubscribe();
    }
  }
}
