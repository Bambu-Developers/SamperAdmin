import { ExcelCommissionService } from './../../services/excel-commission.service';
import { concatMap, take, toArray, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from '../../data/language';
import { UsersService } from './../../../users/services/users.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { InventoryService } from '../../services/inventory.service';
import * as moment from 'moment';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit, OnDestroy {

  public lanInv = INVENTORY_LANGUAGE;
  public lanCom = INVENTORY_LANGUAGE.commission;
  public route: string;
  public startDate: Date;
  public endDate: Date;
  public dataSourceUser: any;
  public dataSourceTableLosses = new MatTableDataSource();
  public dataSourceTableHistory = new MatTableDataSource();
  public dataSourceTableHistoryWholeSale = new MatTableDataSource();
  public dataSourceTableHistoryWholeSaleG = new MatTableDataSource();
  public displayedColumnsLosses = ['sku', 'image', 'name', 'quantity', 'brand', 'subtotal'];
  public displayedColumnsSales = ['sku', 'image', 'name', 'quantity', 'subtotal', 'commission'];
  public displayedColumnsSalesWholesale = ['sku', 'image', 'name', 'quantity', 'subtotal', 'commission'];
  public displayedColumnsSalesWholesaleG = ['sku', 'image', 'name', 'quantity', 'subtotal', 'commission'];
  public route_id: any;
  public user: string;
  public route_name: string;
  public _allLosses: any;
  public _allInventories: any;
  public subtotalInventories: number;
  public _allSales: any;
  public productsSold: any;
  public totalLosses = 0;
  public totalSold = 0;
  public totalToPay = 0;
  public totalCommission = 0;
  public totalCommissionRetail = 0;
  public totalCommissionWholesale = 0;
  public totalCommissionWholesaleG = 0;
  private _subscription: Subscription;
  private _subscriptionService: Subscription;
  private _subscriptionLosses: Subscription;
  private _subscriptionSales: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UsersService,
    private _inventoryService: InventoryService,
    private excelService: ExcelCommissionService
  ) { }

  ngOnInit() {
    this.getDataCommission();
    this.getUser();
    this.getLosses();
    this.getSales();
  }

  public getDataCommission() {
    this._subscription = this._route.queryParams.subscribe(values => {
      this.route = values['route'];
      this.startDate = moment(values['startDate'], 'YYYYMMDD').toDate();
      this.endDate = moment(values['endDate'], 'YYYYMMDD').toDate();
    });
  }

  public getUser() {
    this._subscriptionService = this._userService.getRouteByID(this.route).subscribe(
      res => {
        this.route_name = res.name;
        this.user = res.seller;
        this._subscriptionService = this._userService.getUser(this.user).subscribe(
          user => {
            user['route_name'] = this.route_name;
            this.dataSourceUser = user;
          });
      });
  }

  public getLosses() {
    this._subscriptionLosses = this._inventoryService.getLossesByDate(this.route, this.startDate, this.endDate)
      .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        map((loss: any) => {
          this.totalLosses += (parseFloat(loss.product.retail_price) * loss.number_of_piz);
          return { ...loss.product, number_of_piz: loss.number_of_piz };
        }),
        toArray()
      ).subscribe(losses => {
        const lossesProducts = [];
        losses.forEach(loss => {
          const lossProductIdx = lossesProducts.findIndex((lp: any) => {
            return loss.sku === lp.sku;
          });
          if (lossProductIdx > -1) {
            lossesProducts[lossProductIdx]['numberItems'] += loss.number_of_piz;
            lossesProducts[lossProductIdx]['totalPrice'] += loss.number_of_piz * parseFloat(lossesProducts[lossProductIdx]['retail_price']);
          } else {
            lossesProducts.push({
              ...loss,
              numberItems: loss.number_of_piz,
              totalPrice: loss.number_of_piz * parseFloat(loss.retail_price)
            });
          }
        });
        this.dataSourceTableLosses.data = lossesProducts;
      });
  }

  public getSales() {
    const wholesaleProductsG = [];
    const wholesaleProducts = [];
    const retailProducts = [];
    this._subscriptionSales = this._inventoryService.getSalesByDate(this.route, this.startDate, this.endDate)
      .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        concatMap((sale: any) => {
          const keys = Object.keys(sale.Products || {});
          const productsArray = keys.map(k => {
            const product = sale.Products[k];
            if ((product.number_of_items >= parseFloat(product.wholesale_quantity))
              && (product.number_of_items < parseFloat(product.wholesale_quantityG))) {
              product.commission = ((product.number_of_items * parseFloat(product.wholesale_price))
                * parseFloat(product.seller_commission_wholesale || 0)) / 100.00;
              this.totalCommissionWholesale += product.commission;
              product.iswholesale = true;
            }
            if (product.wholesale_quantityG !== '' && (product.number_of_items >= parseFloat(product.wholesale_quantityG))) {
              product.commission = ((product.number_of_items * parseFloat(product.wholesale_priceG))
                * parseFloat(product.seller_commission_wholesaleG || 0)) / 100.00;
              this.totalCommissionWholesaleG += product.commission;
              product.iswholesaleG = true;
            }
            if (product.number_of_items < parseFloat(product.wholesale_quantity)) {
              product.commission = ((product.number_of_items * parseFloat(product.retail_price))
                * parseFloat(product.seller_commission_retail || 0)) / 100.00;
              this.totalCommissionRetail += product.commission;
              product.iswholesale = false;
              product.iswholesaleG = false;
            }
            this.totalCommission += product.commission;
            return product;
          });
          this.totalSold += sale.totalOnSalle;
          return productsArray;
        }),
        toArray()
      ).subscribe(products => {
        products.forEach(product => {
          const wholesaleproductIdxG = wholesaleProductsG.findIndex(wholesaleProductG => wholesaleProductG.sku === product.sku);
          const wholesaleproductIdx = wholesaleProducts.findIndex(wholesaleProduct => wholesaleProduct.sku === product.sku);
          const retailproductIdx = retailProducts.findIndex(retailProduct => retailProduct.sku === product.sku);
          if (wholesaleproductIdx > -1 && product.iswholesale) {
            wholesaleProducts[wholesaleproductIdx].totalPrice += product.number_of_items * product.wholesale_price;
            wholesaleProducts[wholesaleproductIdx].totalItems += product.number_of_items;
            wholesaleProducts[wholesaleproductIdx].totalCommission += product.commission;
          } else {
            if (product.iswholesale === true) {
              wholesaleProducts.push({
                ...product,
                totalPrice: product.number_of_items * parseFloat(product.wholesale_price),
                totalItems: product.number_of_items,
                totalCommission: product.commission
              });
            }
          }
          if (wholesaleproductIdxG > -1 && product.iswholesaleG) {
            wholesaleProductsG[wholesaleproductIdxG].totalPrice += product.number_of_items * parseFloat(product.wholesale_priceG);
            wholesaleProductsG[wholesaleproductIdxG].totalItems += product.number_of_items;
            wholesaleProductsG[wholesaleproductIdxG].totalCommission += product.commission;
          } else {
            if (product.iswholesaleG === true) {
              wholesaleProductsG.push({
                ...product,
                totalPrice: product.number_of_items * parseFloat(product.wholesale_priceG),
                totalItems: product.number_of_items,
                totalCommission: product.commission
              });
            }
          }
          if (retailproductIdx > -1 && !product.iswholesale && !product.iswholesaleG) {
            retailProducts[retailproductIdx].totalPrice += product.number_of_items * parseFloat(product.retail_price);
            retailProducts[retailproductIdx].totalItems += product.number_of_items;
            retailProducts[retailproductIdx].totalCommission += product.commission;
          } else {
            if (product.iswholesale === false && product.iswholesaleG === false) {
              retailProducts.push({
                ...product,
                totalPrice: product.number_of_items * parseFloat(product.retail_price),
                totalItems: product.number_of_items,
                totalCommission: product.commission
              });
            }
          }
        });
        this.dataSourceTableHistoryWholeSale.data = wholesaleProducts;
        this.dataSourceTableHistoryWholeSaleG.data = wholesaleProductsG;
        this.dataSourceTableHistory.data = retailProducts;
      });
  }

  public downloadCommission() {
    const retailTable = [];
    const wholesaleTable = [];
    const wholesaleTableG = [];
    const lossesTable = [];
    for (const retailSales of this.dataSourceTableHistory.data) {
      retailTable.push({
        'Código SKU': retailSales['sku'],
        'Nombre': retailSales['name'],
        'Cantidad (pzas)': retailSales['totalItems'],
        'Subtotal': retailSales['totalPrice'],
        'Comisión': retailSales['totalCommission']
      });
    }
    for (const wholesaleSales of this.dataSourceTableHistoryWholeSale.data) {
      wholesaleTable.push({
        'Código SKU': wholesaleSales['sku'],
        'Nombre': wholesaleSales['name'],
        'Cantidad (pzas)': wholesaleSales['totalItems'],
        'Subtotal': wholesaleSales['totalPrice'],
        'Comisión': wholesaleSales['totalCommission']
      });
    }
    for (const wholesaleSalesG of this.dataSourceTableHistoryWholeSaleG.data) {
      wholesaleTableG.push({
        'Código SKU': wholesaleSalesG['sku'],
        'Nombre': wholesaleSalesG['name'],
        'Cantidad (pzas)': wholesaleSalesG['totalItems'],
        'Subtotal': wholesaleSalesG['totalPrice'],
        'Comisión': wholesaleSalesG['totalCommission']
      });
    }
    for (const losses of this.dataSourceTableLosses.data) {
      lossesTable.push({
        'Código SKU': losses['sku'],
        'Nombre': losses['name'],
        'Marca': losses['brand'],
        'Cantidad (pzas)': losses['number_of_piz'],
        'Subtotal': losses['totalPrice']
      });
    }
    const start = moment(this.startDate).format('DD-MM-Y');
    const end = moment(this.endDate).format('DD-MM-Y');
    this.excelService.exportAsExcelFile(
      retailTable,
      wholesaleTable,
      wholesaleTableG,
      lossesTable,
      `Comision_${this.route_name}_${start}_${end}`);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscriptionService) {
      this._subscriptionService.unsubscribe();
    }
    if (this._subscriptionLosses) {
      this._subscriptionLosses.unsubscribe();
    }
    if (this._subscriptionSales) {
      this._subscriptionSales.unsubscribe();
    }
  }
}
