import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { PAGINATION } from 'src/app/modules/shared/components/paginator/data/data';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public language = PRODUCTS_LANGUAGE;
  public displayedColumns: string[] = ['img', 'name', 'has_promo', 'brand', 'content', 'quantity', 'retailPrice', 'wholesalePrice'];
  public dataSource = new MatTableDataSource();
  public products = [];
  public indexProducts = 0;
  public subscriptionProducts: Subscription;
  public pagination = PAGINATION;

  constructor(
    private productsService: ProductsService,
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  public getProducts() {
    this.subscriptionProducts = this.productsService.getAllProducts().subscribe(
      res => {
        this.products = res;
        const data = [];
        for (let i = 0; i < this.pagination.perPage; i++) {
          if (res[i]) {
            data.push(res[i]);
            this.indexProducts = this.indexProducts + i;
          }
        }
        this.dataSource.data = data;
        this.pagination.perPage = res.length / 15 < 15 ? res.length : res.length / 15;
        this.pagination.totalItems = res.length;
        this.pagination.totalPages = res.length / 15 < 1 ? 1 : res.length / 15;
      }
    );
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public nextPage() {
    this.pagination.page++;
    this.dataSource.data = [];
    for (let i = this.indexProducts; i < this.pagination.perPage * this.pagination.page; i++) {
        this.dataSource.data.push(this.products[i]);
        this.indexProducts++;
    }
  }

  public beforePage() {
    this.pagination.page--;
    this.dataSource.data = [];
    for (let i = this.indexProducts; i > this.pagination.perPage * this.pagination.page; i--) {
        this.dataSource.data.push(this.products[i]);
        this.indexProducts--;
    }
  }

  ngOnDestroy() {
    this.subscriptionProducts.unsubscribe();
  }

}
