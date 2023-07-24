import { ExcelCommissionService } from '../../../../../shared/services/excel-commission.service';
import { concatMap, take, toArray, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from '../../data/language';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../../../../../shared/services/inventory.service';
import * as moment from 'moment';
import { UsersService } from 'src/app/modules/shared/services/users.service';
import { RouteService } from 'src/app/modules/shared/services/route.service';

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
    private excelService: ExcelCommissionService,
    private routeService: RouteService
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
    this._subscriptionService = this.routeService.getRouteByID(this.route).subscribe(
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
    this._subscriptionLosses = this._inventoryService.getLossesCommission(this.route, this.startDate, this.endDate).subscribe(losses => {



        const lossesProducts = [];
        losses.forEach(loss => {
          const lossProductIdx = lossesProducts.findIndex((lp: any) => {
            return loss.sku === lp.sku;
          });
          if (lossProductIdx > -1) {
            lossesProducts[lossProductIdx]['numberItems'] += loss.number_of_piz;
            lossesProducts[lossProductIdx]['totalPrice'] += loss.number_of_piz * parseFloat(lossesProducts[lossProductIdx].product['retail_price']);
          } else {
            lossesProducts.push({
              ...loss,
              numberItems: loss.number_of_piz,
              totalPrice: loss.number_of_piz * parseFloat(loss.product.retail_price)
            });
          }

        });
        lossesProducts.forEach(element => {
          this.totalLosses = this.totalLosses + element.number_of_piz * parseFloat(element.product.retail_price);
        });
        this.dataSourceTableLosses.data = lossesProducts;
      });
  }

  public getSales() {
    const wholesaleProductsG = [];
    const wholesaleProducts = [];
    const retailProducts = [];
    this._subscriptionSales = this._inventoryService.getSales(this.route, this.startDate, this.endDate).subscribe( async (products) => {

      const dataItems = [];

      for await (const iterator of products) {
        if ( iterator.producst != undefined ) {
          iterator.producst.forEach( ( elementProducts , indexProducts ) => {
            dataItems.push(elementProducts);
          } );
        }
      }

      dataItems.forEach(( items ) => {
        items.wholesale_quantity == '' ? items.wholesale_quantity = '0.0' : null
        items.wholesale_quantityG == '' ? items.wholesale_quantityG = '0.0' : null
        if (
          items.wholesale_quantityG !== '0.0' &&
          items.number_of_items >= parseFloat(items.wholesale_quantity) &&
          items.number_of_items < parseFloat(items.wholesale_quantityG)
        ) {
          console.log(parseFloat(items.seller_commission_wholesale));
          this.totalCommission = this.totalCommission + (items.number_of_items  * items.wholesale_quantity  * parseFloat(items.seller_commission_wholesale)) / 100;
          this.totalCommissionWholesale = this.totalCommissionWholesale + (items.number_of_items  * items.wholesale_quantity  * parseFloat(items.seller_commission_wholesale)) / 100;

          let newsku = true;
          wholesaleProducts.find( function (elementAux: any , index) {
            if (items.sku === elementAux.sku ) {
              wholesaleProducts[index].number_of_items =  wholesaleProducts[index].number_of_items + items.number_of_items;
              wholesaleProducts[index].totalPrice =  wholesaleProducts[index].totalPrice + (items.number_of_items  * parseFloat(items.wholesale_quantity) );
              wholesaleProducts[index].totalCommission =  wholesaleProducts[index].totalCommission + (items.number_of_items  * parseFloat(items.wholesale_quantity)  * parseFloat(items.seller_commission_wholesale)) / 100;
              newsku = false;

            }
          });
          if (newsku) {
            items.totalPrice = 0;
            items.totalCommission = 0;
            items.totalPrice =  items.totalPrice + (items.number_of_items  *  parseFloat(items.wholesale_quantity));
            items.totalCommission =  items.totalCommission + (items.number_of_items * parseFloat(items.wholesale_quantity)  * parseFloat(items.seller_commission_wholesale)) / 100;
            wholesaleProducts.push(items);
          }
        }
        if (
          items.wholesale_quantityG !== '0.0' &&
          items.number_of_items >= parseFloat(items.wholesale_quantityG)
        ) {

          this.totalCommission = this.totalCommission + (items.number_of_items  * items.wholesale_priceG  * parseFloat(items.seller_commission_wholesaleG)) / 100;
          this.totalCommissionWholesaleG = this.totalCommissionWholesaleG + (items.number_of_items  * parseFloat(items.wholesale_priceG)  * parseFloat(items.seller_commission_wholesaleG)) / 100;
          let newsku = true;
          wholesaleProductsG.find( function (elementAux: any , index) {
            if (items.sku === elementAux.sku ) {
              wholesaleProductsG[index].number_of_items =  wholesaleProductsG[index].number_of_items + items.number_of_items;
              wholesaleProductsG[index].totalPrice =  wholesaleProductsG[index].totalPrice + (items.number_of_items  * parseFloat(items.wholesale_priceG) );
              wholesaleProductsG[index].totalCommission =  wholesaleProductsG[index].totalCommission + (items.number_of_items  * parseFloat(items.wholesale_priceG)  * parseFloat(items.seller_commission_wholesaleG)) / 100;
              newsku = false;
            }
          });
          if (newsku) {
            items.totalPrice = 0;
            items.totalCommission = 0;
            items.totalPrice =  items.totalPrice + (items.number_of_items  *  parseFloat(items.wholesale_priceG));
            items.totalCommission =  items.totalCommission + (items.number_of_items * parseFloat(items.wholesale_priceG)  * parseFloat(items.seller_commission_wholesaleG)) / 100;
            wholesaleProductsG.push(items);
          }
        }
        if (items.number_of_items < parseFloat(items.wholesale_quantity) || parseFloat(items.wholesale_quantity) == 0 ) {
          this.totalCommission = this.totalCommission + (items.number_of_items  * items.retail_price  * parseFloat(items.seller_commission_retail)) / 100;
          this.totalCommissionRetail = this.totalCommissionRetail + (items.number_of_items  * items.retail_price  * parseFloat(items.seller_commission_retail)) / 100;
          let newsku = true;
          retailProducts.find( function (elementAux: any , index) {
            if (items.sku === elementAux.sku ) {
              retailProducts[index].number_of_items =  retailProducts[index].number_of_items + items.number_of_items;
              retailProducts[index].totalPrice =  retailProducts[index].totalPrice + (items.number_of_items  * items.retail_price );
              retailProducts[index].totalCommission =  retailProducts[index].totalCommission + (items.number_of_items  * items.retail_price  * parseFloat(items.seller_commission_retail)) / 100;
              newsku = false;
            }
          });
          if (newsku) {
            items.totalPrice = 0;
            items.totalCommission = 0;
            items.totalPrice =  items.totalPrice + (items.number_of_items  * items.retail_price);
            items.totalCommission =  items.totalCommission + (items.number_of_items  * items.retail_price  * parseFloat(items.seller_commission_retail)) / 100;
            retailProducts.push(items);
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
        'Cantidad (pzas)': retailSales['number_of_items'],
        'Subtotal': retailSales['totalPrice'],
        'Comisión': retailSales['totalCommission']
      });
    }
    for (const wholesaleSales of this.dataSourceTableHistoryWholeSale.data) {
      wholesaleTable.push({
        'Código SKU': wholesaleSales['sku'],
        'Nombre': wholesaleSales['name'],
        'Cantidad (pzas)': wholesaleSales['number_of_items'],
        'Subtotal': wholesaleSales['totalPrice'],
        'Comisión': wholesaleSales['totalCommission']
      });
    }
    for (const wholesaleSalesG of this.dataSourceTableHistoryWholeSaleG.data) {
      wholesaleTableG.push({
        'Código SKU': wholesaleSalesG['sku'],
        'Nombre': wholesaleSalesG['name'],
        'Cantidad (pzas)': wholesaleSalesG['number_of_items'],
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
