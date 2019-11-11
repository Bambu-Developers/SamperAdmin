import { ClientsService } from './../../../clients/services/clients.service';
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
  public totalReturned = 0;
  public date: Date;
  public ticket: any;
  public client: any;
  public clientID: any;
  public route_name = '';
  private _subscriptionTicket: Subscription;
  private _subscriptionDevolutions: Subscription;
  private _subscriptionClient: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _inventoryService: InventoryService,
    private _clientService: ClientsService
  ) { }

  ngOnInit() {
    this.getParams();
  }

  public getParams() {
    const params = this._route.snapshot.queryParams;
    this.ticket = params['ticket'];
    const routeId = params['route'];
    this.getDevolutions(routeId, this.ticket);
    this.getTicketData(routeId, this.ticket);
  }

  public getDevolutions(route, ticket) {
    this._inventoryService.getSaleByTicket(route, ticket)
      .valueChanges()
      .pipe(
        concatMap(x => x),
        filter((t: any) => {
          return t.id === ticket;
        })
      )
      .subscribe(devolutions => {
        let returnedProducts = [];
        if (devolutions.Devolutions) {
          returnedProducts = Object.values(devolutions.Devolutions);
          returnedProducts.map(dev => {
            dev['totalPrice'] = dev.number_of_items * dev.retail_price;
            this.totalReturned += dev.totalPrice;
          });
        }
        this.dataSourceReturnedTable.data = returnedProducts;
      });
    // this._subscriptionDevolutions = this._inventoryService.getDevolutions()
    //   .valueChanges()
    //   .pipe(
    //     take(1),
    //     concatMap(x => x),
    //     filter((product: any) => product.orderId === ticket),
    //     toArray()
    //   ).subscribe(products => {
    //     console.log(products);
    //     products.forEach(dev => {
    //       const returnedProductIdx = returnedProducts.findIndex((rp: any) => {
    //         return rp.sku === dev.sku;
    //       });
    //       if (returnedProductIdx > -1) {
    //         returnedProducts[returnedProductIdx]['numberItems'] += 1;
    //         returnedProducts[returnedProductIdx]['totalPrice'] += parseFloat(dev.retail_price);
    //       }
    //       returnedProducts.push({
    //         ...dev,
    //         numberItems: 1,
    //         totalPrice: parseFloat(dev.retail_price)
    //       });
    //     });
    //     this.dataSourceReturnedTable.data = returnedProducts;
    //   });
  }

  public getTicketData(route, ticket) {
    this._subscriptionTicket = this._inventoryService.getSaleByTicket(route, ticket)
      .valueChanges()
      .pipe(
        concatMap(x => x),
        filter((t: any) => {
          return t.id === ticket;
        }),
        map(sale => {
          console.log(sale);
          this.clientID = sale.customerId;
          this.date = sale.date as Date;
          this.route_name = sale.route_name as string;
          const products = sale.Products || '';
          const productKeys = Object.keys(products);
          this.totalSold = sale.totalOnSalle;
          return productKeys.map(pkey => products[pkey]);
        })
      ).subscribe(products => {
        const retailProducts = [];
        const wholesaleProducts = [];
        const wholesaleProductsG = [];
        products.forEach(product => {
          product = { ...product, route_name: this.route_name };
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
        this.getClient();
      });
  }

  public getClient() {
    this._subscriptionClient = this._clientService.getClient(this.clientID).subscribe(client => {
      this.client = client;
    });
  }

  ngOnDestroy() {
    if (this._subscriptionDevolutions) {
      this._subscriptionDevolutions.unsubscribe();
    }
    if (this._subscriptionTicket) {
      this._subscriptionTicket.unsubscribe();
    }
    if (this._subscriptionClient) {
      this._subscriptionClient.unsubscribe();
    }
  }

}
