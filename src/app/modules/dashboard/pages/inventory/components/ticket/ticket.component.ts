import { InventoryService } from './../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { take, concatMap, toArray, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnDestroy {

  public lanInv = INVENTORY_LANGUAGE;
  public dataSourceRetailTable = new MatTableDataSource();
  public dataSourceWholesaleTable = new MatTableDataSource();
  public dataSourceWholesaleTableG = new MatTableDataSource();
  public dataSourceReturnedTable = new MatTableDataSource();
  public dataSourceLossesTable = new MatTableDataSource();
  public displayedRetailColumns = ['image', 'name', 'route', 'brand', 'quantity', 'price', 'total'];
  public displayedColumnsReturned = ['sku', 'image', 'name', 'quantity', 'brand', 'total'];
  public displayedColumnsLosses = ['sku', 'image', 'name', 'quantity', 'brand', 'total'];
  public totalSold = 0;
  public date: Date;
  public ticket: any;
  private _subscriptionTicket: Subscription;
  private _subscriptionDevolutions: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _inventoryService: InventoryService,
  ) { }

  ngOnInit() {
    this.getParams();
  }

  public getParams() {
    const params = this._route.snapshot.queryParams;
    this.ticket = params['ticket'];
    const routeId = params['route'];
    this.getDevolutions(this.ticket);
    this.getTicketData(routeId, this.ticket);
  }

  public getDevolutions(ticket) {
    const returnedProducts = [];
    this._subscriptionDevolutions = this._inventoryService.getDevolutions()
      .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        filter((product: any) => product.orderId === ticket),
        toArray()
      ).subscribe(products => {
        products.forEach(dev => {
          const returnedProductIdx = returnedProducts.findIndex((rp: any) => {
            return rp.sku === dev.sku;
          });
          if (returnedProductIdx > -1) {
            returnedProducts[returnedProductIdx]['numberItems'] += 1;
            returnedProducts[returnedProductIdx]['totalPrice'] += parseFloat(dev.retail_price);
          }
          returnedProducts.push({
            ...dev,
            numberItems: 1,
            totalPrice: parseFloat(dev.retail_price)
          });
        });
        this.dataSourceReturnedTable.data = returnedProducts;
      });
  }

  public getTicketData(route, ticket) {
    let route_name = '';
    this._subscriptionTicket = this._inventoryService.getSaleByTicket(route, ticket)
      .valueChanges()
      .pipe(
        map(sale => {
          this.date = sale[2] as Date;
          route_name = sale[6] as string;
          const products = sale[0];
          const productKeys = Object.keys(products);
          this.totalSold = sale[10] as number;
          return productKeys.map(pkey => products[pkey]);
        })
      ).subscribe(products => {
        const retailProducts = [];
        const wholesaleProducts = [];
        const wholesaleProductsG = [];
        products.forEach(product => {
          product = { ...product, route_name: route_name };
          if (product.wholesale_quantityG !== '' && (product.number_of_items >= product.wholesale_quantity)
            && (product.number_of_items < product.wholesale_quantityG)) {
            wholesaleProducts.push(product);
          }
          if (product.wholesale_quantityG !== '' && (product.number_of_items >= product.wholesale_quantityG)) {
            wholesaleProductsG.push(product);
          }
          if (product.number_of_items < product.wholesale_quantity) {
            retailProducts.push(product);
          }
        });
        this.dataSourceRetailTable.data = retailProducts;
        this.dataSourceWholesaleTable.data = wholesaleProducts;
        this.dataSourceWholesaleTableG.data = wholesaleProductsG;
      });
  }

  ngOnDestroy() {
    if (this._subscriptionDevolutions) {
      this._subscriptionDevolutions.unsubscribe();
    }
    if (this._subscriptionTicket) {
      this._subscriptionTicket.unsubscribe();
    }
  }

}
