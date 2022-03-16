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
  public product: Observable<ProductModel>;
  public NEW_NAME;
  private _basePath = 'Developer/Groups/';

  constructor(
    private _db: AngularFireDatabase,
    private _storage: AngularFireStorage,
  ) {
    this.productsRef = this._db.list<ProductModel>(this._basePath);
  }

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

  public registerProduct(productData) {
    this.setProductData(productData);
  }

  public editProduct(productData, id) {
    this.setEditedProductData(productData, id);
  }

  public editPromotion(promotionData, id) {
    this.setPromotionData(promotionData, id);
  }

  public registerPromotion(promotion, id) {
    this.setPromotionData(promotion, id);
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
      wholesale_priceG: product.wholesalePrice,
      wholesale_quantityG: product.wholesaleQuantity,
      // monday_price: product.mondayPrice,
      // tuesday_price: product.tuesdayPrice,
      // wednesday_price: product.wednesdayPrice,
      // thursday_price: product.thursdayPrice,
      // friday_price: product.fridayPrice,
      // saturday_price: product.saturdayPrice,
      // sunday_price: product.sundayPrice,
      seller_commission_retail: product.sellerCommissionRetail,
      seller_commission_wholesale: product.sellerCommissionWholesale,
      seller_commission_wholesaleG: product.sellerCommissionWholesale,
      is_enabled: true,
    };
    this.productsRef.push(PRODUCT_DATA);
  }

  public setEditedProductData(product, id) {
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
      // monday_price: product.mondayPrice,
      // tuesday_price: product.tuesdayPrice,
      // wednesday_price: product.wednesdayPrice,
      // thursday_price: product.thursdayPrice,
      // friday_price: product.fridayPrice,
      // saturday_price: product.saturdayPrice,
      // sunday_price: product.sundayPrice,
      seller_commission_retail: product.sellerCommissionRetail,
      seller_commission_wholesale: product.sellerCommissionWholesale,
      seller_commission_wholesaleG: product.sellerCommissionWholesaleG,
    };
    this.productsRef.update(id, PRODUCT_DATA);
  }

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
    this.productsRef.update(id, PRODUCT_DATA);
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

  // Get product by ID
  public getProduct(id: string): Observable<ProductModel> {
    return this.product = this._db.object<ProductModel>(`${this._basePath}/` + id)
      .snapshotChanges()
      .pipe(
        map(res => res.payload.val())
      );
  }

  public removeProduct(id: string) {
    this.deleteProductData(id);
    this.deleteImageStorage();
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
    this.productsRef.update(id, PRODUCT_DATA);
  }

  public setDisponibility(id: string, disponibility: boolean) {
    const PRODUCT_DATA: ProductModel = {
      is_enabled: disponibility
    };
    this.productsRef.update(id, PRODUCT_DATA);
  }

  public deleteProductData(id: string) {
    this._db.object(`${this._basePath}/` + id).remove();
  }

  public deleteImageStorage() {
    const storageRef = this._storage.ref(this._basePath);
    storageRef.child(this.NEW_NAME).delete();
  }
}
