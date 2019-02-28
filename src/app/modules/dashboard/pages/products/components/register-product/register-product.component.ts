import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PRODUCTS_LANGUAGE } from '../../data/language';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ProductModel } from '../../models/product.model';
import { Upload } from '../../models/upload.model';
import { CURRENCY_MASK, NUMBER_MASK } from '../../../../../../directives/currency-mask';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss']
})
export class RegisterProductComponent implements OnInit, OnDestroy {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public registerProductForm: FormGroup;
  public subscriptionRoutes: Subscription;
  public currentProduct: ProductModel;
  public selectedFiles: FileList;
  public currentUpload: Upload;
  public imgURL: any;
  public imagePath;
  public baseValue = 0.00;
  public currencyMask = CURRENCY_MASK;
  public numberMask = NUMBER_MASK;
  public showPricingPerDay = false;
  public file;


  constructor( private productService: ProductsService ) {  }

  public detectFiles( event ) {
      this.selectedFiles = event.target.files;
  }

  public uploadSingle() {
    this.file = this.selectedFiles.item(0)
    this.currentUpload = new Upload( this.file );
    this.productService.imageUpload( this.currentUpload )
  }

  ngOnInit() {
    this.registerProductForm = new FormGroup({
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
      ])
    });
  }

  public registerProduct() {
    if (this.registerProductForm.valid) {
      console.log( this.registerProductForm.value )
      this.productService.registerProduct( this.registerProductForm.value )
    } else {
      // Handle Errors
      console.log('Error')
    }
  }

  public preview( files ) {
    if ( files.length === 0 )
      return;
    var mimeType = files[0].type;
    if (mimeType.match( /image\/*/ ) == null) {
      //mat-error
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL( files[0] );
    reader.onload = ( _event ) => {
      this.imgURL = reader.result;
    }
  }

  deleteImage() {
    if (this.file.name !== null) {
      this.productService.deleteFileStorage(this.file.name)
    } else {
      console.log('Error')
    }
  }

  ngOnDestroy() { }

}
