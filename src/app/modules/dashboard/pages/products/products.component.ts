import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';

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
    private productsService: ProductsService,
    private router: Router
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

  // public selectedProduct(product) {
  //   this.router.navigate(['/dashboard/products/view/' + product.id]);
  // }

  ngOnDestroy() {
    this.subscriptionProducts.unsubscribe();
  }

}
