import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductModel } from '../models/product.model';
import * as firebase from 'firebase';
import { Upload } from '../models/upload.model';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public productsRef: AngularFireList<ProductModel>;
  private basePath:string = 'Developer/Groups';
  public img_preview_url: string;

  constructor( public db: AngularFireDatabase ) {
    this.productsRef = this.db.list<ProductModel>('Developer/Groups')
  }

  imageUpload(upload: Upload) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
      }
    }, function(error) {

    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then( (downloadURL) => {
        this.img_preview_url = upload.img_preview_url = downloadURL
      });
    });
  }

  private saveFileData( upload: Upload ) {
    this.db.list<Upload>(`${this.basePath}/`).push(upload);
  }

  public registerProduct( productData ) {
    this.setProductData(productData)
  }

  public deleteFileStorage(name:string) {
    let storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

  // Writes the file details to the realtime db
  private setProductData(product) {
    const PRODUCT_DATA: ProductModel = {
      img_preview_url: this.img_preview_url,
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      units_package: product.unitsPackage,
      category: product.category,
      content: product.content,
      retail_price: product.retailPrice,
      wholesale_price: product.wholesalePrice,
      wholesale_quantity: product.wholesaleQuantity,
      monday_price: product.mondayPrice,
      tuesday_price: product.tuesdayPrice,
      wednesday_price: product.wednesdayPrice,
      thursday_price: product.thursdayPrice,
      friday_price: product.fridayPrice,
      saturday_price: product.saturdayPrice,
      sunday_price: product.sundayPrice
    }
    this.productsRef.push(PRODUCT_DATA);
  }

  //Get all products
  public getAllProducts(): Observable<ProductModel[]> {
    return this.productsRef
    .snapshotChanges()
    .pipe(
      map(changes =>
        changes.map(c => {
          const data = c.payload.val() as ProductModel;
          const id = c.payload.key;
          return { id, ...data };
        })
      )
    );
  }
}
