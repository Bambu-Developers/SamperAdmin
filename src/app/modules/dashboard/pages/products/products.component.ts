import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { PAGINATION } from 'src/app/modules/shared/components/paginator/data/data';
import { ProductService } from 'src/app/modules/shared/services/product.service';

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
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public getProducts() {

    this.subscriptionProducts = this.productService.getAllProducts().subscribe( ress => {
      this.dataSource.data = ress;
      const data = [];
      for (let i = 0; i < this.pagination.perPage; i++) {
        if (ress[i]) {
          data.push(ress[i]);
          this.indexProducts = this.indexProducts + i;
        }
      }
    });
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
