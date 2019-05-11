import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public language = PRODUCTS_LANGUAGE;
  public displayedColumns: string[] = ['img', 'name', 'has_promo', 'brand', 'content', 'quantity', 'retailPrice', 'wholesalePrice'];
  public dataSource = new MatTableDataSource();
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
        this.dataSource.data = res;
      }
    );
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this.subscriptionProducts.unsubscribe();
  }

}
