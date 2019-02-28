import { Component, OnInit, OnDestroy } from '@angular/core';
import { PRODUCTS_LANGUAGE } from './data/language';
import { ProductsService } from './services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public language = PRODUCTS_LANGUAGE;
  public displayedColumns: string[] = ['img', 'name', 'brand', 'content', 'quantity', 'retailPrice', 'wholesalePrice'];
  public dataSource: any;

  public products;
  public subscriptionProducts: Subscription;

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  public getProducts() {
    this.subscriptionProducts = this.productsService.getAllProducts().subscribe(
      res => {
        this.dataSource = res;
      }
    );
  }

  ngOnDestroy() {
    this.subscriptionProducts.unsubscribe();
  }

}
