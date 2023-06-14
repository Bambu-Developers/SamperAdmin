import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { ProductModel } from '../../dashboard/pages/products/models/product.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';



import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsCollection: AngularFirestoreCollection<ProductModel>;
  private productDoc: AngularFirestoreDocument<ProductModel>;
  private products: Observable<ProductModel[]>;
  public product: Observable<ProductModel>;
  public NEW_NAME;
  private _basePath = 'Staging/Groups/';

  constructor(
    private _storage: AngularFireStorage,
    private firestore: AngularFirestore,


    private http: HttpClient
  ) {}

  // Get all products
  public getAllProducts(): Observable<ProductModel[]> {
    this.productsCollection = this.firestore.collection<ProductModel>('Products');
    this.products = this.productsCollection.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => {
          const data = c.payload.doc.data() as ProductModel;
          const id = c.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.products;
  }

  // Get product by ID
  public getProductId(id: string): Observable<ProductModel> {
    this.productDoc = this.firestore.collection('Products').doc(id);
    this.product = this.productDoc.snapshotChanges().pipe(
      map((res) => {
        const data = res.payload.data() as ProductModel;
        const productId = res.payload.id;
        return { id: productId, ...data };
      })
    );
    return this.product;
  }

   // Set new product
  public createProduct(product: any): Promise<void> {
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
      wholesale_priceG: product.wholesalePrice,
      wholesale_quantityG: product.wholesaleQuantity,
      seller_commission_retail: product.sellerCommissionRetail,
      seller_commission_wholesale: product.sellerCommissionWholesale,
      seller_commission_wholesaleG: product.sellerCommissionWholesale,
      is_enabled: true,
    };
    return this.firestore.collection<ProductModel>('Products').add(PRODUCT_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }

  // edit product
  public editedProduct(product: any, id: string) {
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
      wholesale_priceG: product.wholesalePriceG,
      wholesale_quantityG: product.wholesaleQuantityG,
      seller_commission_retail: product.sellerCommissionRetail,
      seller_commission_wholesale: product.sellerCommissionWholesale,
      seller_commission_wholesaleG: product.sellerCommissionWholesaleG,
    };
    return this.firestore.collection('Products').doc(id).update(PRODUCT_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }

  // up Img
  public imageUpload(image: any) {
    image = 'data:image/jpeg;base64,' + image;
    return new Promise<any>((resolve, reject) => {
      this.NEW_NAME = `${new Date().getTime()}`;
      const PATH = `${this._basePath}/${this.NEW_NAME}`;
      this._storage.ref(PATH).putString(image, 'data_url').then(
        response => resolve(
          this._storage.ref(PATH).getDownloadURL()
        ),
        (error: any) => {
        });
    });
  }

    // create Promotio
  public setPromotionData(promotion, id) {
    const PRODUCT_DATA: ProductModel = {
      has_promo: true,
      monday_price_promo: promotion.mondayPrice,
      tuesday_price_promo: promotion.tuesdayPrice,
      wednesday_price_promo: promotion.wednesdayPrice,
      thursday_price_promo: promotion.thursdayPrice,
      friday_price_promo: promotion.fridayPrice,
      saturday_price_promo: promotion.saturdayPrice,
      sunday_price_promo: promotion.sundayPrice,
      wholesale_price_promo: promotion.wholesalePrice,
      start_date_promo: promotion.startDate,
      end_date_promo: promotion.endDate
    };
    return this.firestore.collection('Products').doc(id).update(PRODUCT_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }

  public removePromotion(id: string) {
    const PRODUCT_DATA: ProductModel = {
      has_promo: false,
      monday_price_promo: '',
      tuesday_price_promo: '',
      wednesday_price_promo: '',
      thursday_price_promo: '',
      friday_price_promo: '',
      saturday_price_promo: '',
      sunday_price_promo: '',
      wholesale_price_promo: '',
      start_date_promo: '',
      end_date_promo: ''
    };
    return this.firestore.collection('Products').doc(id).update(PRODUCT_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }

  public removeProduct(id: string) {
    this.deleteProductData(id);
    this.deleteImageStorage();
  }

  public deleteProductData(productId: string): Promise<void> {
    this.productDoc = this.firestore.collection('Products').doc(productId);
    return this.productDoc.delete().then(() => {
    }).catch((error) => {
      return error
    });
  }

  public deleteImageStorage() {
    const storageRef = this._storage.ref(this._basePath);
    storageRef.child(this.NEW_NAME).delete();
  }

  public setDisponibility(id: string, disponibility: boolean) {
    const PRODUCT_DATA: ProductModel = {
      is_enabled: disponibility
    };
    return this.firestore.collection('Products').doc(id).update(PRODUCT_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }


  // Migrar Bases
  getJsonKeys() {
    this.http.get<any>('../../../../assets/sanper-stable-4877495879-export.json').subscribe(
      (data) => {
        const keyAux = Object.keys(data);
        keyAux.forEach(  ( colection: any , index ) => {
          const ArrayProductsAux = [];
          if (data[colection].Products != undefined) {
            const keyColections = Object.keys(data[colection].Products);
            keyColections.forEach(  ( produc: any , producIndex ) => {
              ArrayProductsAux.push(data[colection].Products[produc]);
            });
          }
            return this.firestore.collection('HistoryRoutes').doc('4877495879').collection('Orders' ).doc( colection).set(data[colection]).then((ress) => { }).catch((error) => {
              return error;
            });
          }
        );
      },
      (error) => {
        return [];
      }
    );
  }
}

