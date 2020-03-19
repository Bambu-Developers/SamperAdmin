import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { PAGINATION } from 'src/app/modules/shared/components/paginator/data/data';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {

  public language = PRODUCTS_LANGUAGE;
  public displayedColumns: string[] = ['img', 'name', 'has_promo', 'brand', 'content', 'quantity', 'retailPrice', 'wholesalePrice'];
  public dataSource = new MatTableDataSource();
  public indexProducts = 0;
  public subscriptionProducts: Subscription;
  public pagination = PAGINATION;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private productsService: ProductsService,
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public getProducts() {
    this.subscriptionProducts = this.productsService.getAllProducts().subscribe(
      res => {
        this.dataSource.data = res;
        const data = [];
        for (let i = 0; i < this.pagination.perPage; i++) {
          if (res[i]) {
            data.push(res[i]);
            this.indexProducts = this.indexProducts + i;
          }
        }
      }
    );
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this.subscriptionProducts) {
      this.subscriptionProducts.unsubscribe();
    }
  }

}
