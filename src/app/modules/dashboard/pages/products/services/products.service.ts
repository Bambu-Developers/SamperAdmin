import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProductModel } from 'src/app/modules/dashboard/pages/products/models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public productsRef: AngularFireList<ProductModel>;
  private basePath = 'Developer/Groups';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    this.productsRef = this.db.list<ProductModel>('Developer/Groups');
  }

  imageUpload(image: any) {
    image = 'data:image/jpeg;base64,' + image;
    return new Promise<any>((resolve, reject) => {
      const NEW_NAME = `${new Date().getTime()}`;
      const PATH = `${this.basePath}/${NEW_NAME}`;
      this.storage.ref(PATH).putString(image, 'data_url').then(
        response => resolve(
          this.storage.ref(PATH).getDownloadURL()
        ),
        (error: any) => {
        }
      );
    });
  }

  public registerProduct( productData ) {
    this.setProductData( productData );
  }

  // Writes the file details to the realtime db
  private setProductData(product) {
    const PRODUCT_DATA: ProductModel = {
      img_preview_url: product.image,
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
    };
    this.productsRef.push(PRODUCT_DATA);
  }

  // Get all products
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
