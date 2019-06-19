import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from '../../data/language';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../users/services/users.service';
import { InventoryService } from './../../services/inventory.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/modules/shared/components/dialog/dialog.component';
import { concatMap, map, take, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.scss'],
})
export class LiquidationComponent implements OnInit, OnDestroy {

  public lanLiq = INVENTORY_LANGUAGE.liquidation;
  public lanInv = INVENTORY_LANGUAGE;
  public uid: string;
  public user: any;
  public id: string;
  public dataSource: any;
  public dataSourceTable = new MatTableDataSource();
  public dataSourceWholesaleTable = new MatTableDataSource();
  public dataSourceWholesaleTableG = new MatTableDataSource();
  public dataSourceDevolutions = new MatTableDataSource();
  public dataSourceLosses = new MatTableDataSource();
  public displayedColumns = ['sku', 'image', 'name', 'quantity', 'brand', 'subtotal'];
  public displayedColumnsDevolutions = ['sku', 'image', 'name', 'quantity', 'brand', 'subtotal'];
  public displayedColumnsLosses = ['sku', 'image', 'name', 'quantity', 'brand', 'subtotal'];
  public userRoute;
  public devolutions;
  public devolutionsArray = new Array();
  public today = new Date().toString();
  public _allLosses: any;
  public _allInventories: any;
  public totalDevolutions = 0;
  public subtotalInventories = 0;
  public totalLosses = 0;
  public totalLiquidation = 0;
  public returnedProducts = [];
  public existLiquidation = false;
  public allLiquidations: any;
  public totalSold: any = 0;
  public totalSaleWholesale: any = 0;
  public totalSaleWholesaleG: any = 0;
  public totalSaleRetail: any = 0;
  public totalSale: any = 0;
  private _subscription: Subscription;
  private _subscriptionService: any;
  private _subscriptionInventories: Subscription;
  private _subscriptionDevolutions: Subscription;
  private _subscriptionLosses: Subscription;
  private _subscriptionLiquidation: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UsersService,
    private _inventoryService: InventoryService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog,
  ) {
    this.today = this._datePipe.transform(this.today, 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.getUser();
    this.getDevolutions();
    this.getLiquidation();
  }

  public getUser() {
    this._subscription = this._route.params.subscribe(params => {
      this.id = params['id'];
      this._subscriptionService = this._userService.getUser(this.id).subscribe(
        res => {
          this.dataSource = res;
          this.userRoute = res.route || params['id'];
          this.getInventories();
          this.getLosses();
        });
    });
  }

  public getInventories() {
    const wholesaleProducts = [];
    const wholesaleProductsG = [];
    const retailProducts = [];
    this._subscriptionInventories = this._inventoryService.getSalesFromKeys(this.userRoute)
      .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        concatMap((sale: any) => {
          if (!this.dataSource.name) {
            this.dataSource = { name: sale.route_name };
          }
          const keys = Object.keys(sale.Products || {});
          const productsArray = keys.map(k => {
            const product = sale.Products[k];
            if ((product.number_of_items >= product.wholesale_quantity) && (product.number_of_items < product.wholesale_quantityG)) {
              product.subtotal = ((product.number_of_items * product.wholesale_price));
              this.totalSaleWholesale += product.subtotal;
              product.iswholesale = true;
            }
            if (product.wholesale_quantityG !== '' && (product.number_of_items >= product.wholesale_quantityG)) {
              product.subtotal = ((product.number_of_items * product.wholesale_priceG));
              this.totalSaleWholesaleG += product.subtotal;
              product.iswholesaleG = true;
            }
            if (product.number_of_items < product.wholesale_quantity) {
              product.subtotal = ((product.number_of_items * product.retail_price));
              this.totalSaleRetail += product.subtotal;
              product.iswholesale = false;
              product.iswholesaleG = false;
            }
            return product;
          });
          this.totalSold += sale.totalOnSalle;
          return productsArray;
        }),
        toArray()
      ).subscribe(products => {
        products.forEach(product => {
          const wholesaleproductIdx = wholesaleProducts.findIndex(wholesaleProduct => wholesaleProduct.sku === product.sku);
          const wholesaleproductIdxG = wholesaleProductsG.findIndex(wholesaleProductG => wholesaleProductG.sku === product.sku);
          const retailproductIdx = retailProducts.findIndex(retailProduct => retailProduct.sku === product.sku);
          if (wholesaleproductIdx > -1 && product.iswholesale) {
            wholesaleProducts[wholesaleproductIdx].totalPrice += product.number_of_items * product.wholesale_price;
            wholesaleProducts[wholesaleproductIdx].totalItems += product.number_of_items;
            wholesaleProducts[wholesaleproductIdx].totalCommission += product.commission;
          } else {
            if (product.iswholesale === true) {
              wholesaleProducts.push({
                ...product,
                totalPrice: product.number_of_items * product.wholesale_price,
                totalItems: product.number_of_items,
                totalCommission: product.commission
              });
            }
          }
          if (wholesaleproductIdxG > -1 && product.iswholesaleG) {
            wholesaleProductsG[wholesaleproductIdxG].totalPrice += product.number_of_items * product.wholesale_priceG;
            wholesaleProductsG[wholesaleproductIdxG].totalItems += product.number_of_items;
            wholesaleProductsG[wholesaleproductIdxG].totalCommission += product.commission;
          } else {
            if (product.iswholesaleG === true) {
              wholesaleProductsG.push({
                ...product,
                totalPrice: product.number_of_items * product.wholesale_priceG,
                totalItems: product.number_of_items,
                totalCommission: product.commission
              });
            }
          }
          if (retailproductIdx > -1 && !product.iswholesale && !product.iswholesaleG) {
            retailProducts[retailproductIdx].totalPrice += product.number_of_items * product.retail_price;
            retailProducts[retailproductIdx].totalItems += product.number_of_items;
            retailProducts[retailproductIdx].totalCommission += product.commission;
          } else {
            if (product.iswholesale === false && product.iswholesaleG === false) {
              retailProducts.push({
                ...product,
                totalPrice: product.number_of_items * product.retail_price,
                totalItems: product.number_of_items,
                totalCommission: product.commission
              });
            }
          }
        });
        this.dataSourceTable.data = retailProducts;
        this.dataSourceWholesaleTable.data = wholesaleProducts;
        this.dataSourceWholesaleTableG.data = wholesaleProductsG;
      });
  }


  public getDevolutions() {
    const returnedProducts = new Array();
    this._subscriptionDevolutions = this._inventoryService.getDevolutionsL().subscribe(
      res => {
        this.devolutions = res;
        this.devolutions = this.devolutions
          .map(d => {
            d.date = this._datePipe.transform(d.date, 'yyyy-MM-dd');
            return d;
          })
          .filter(d => d.seller === this.id && d.date === this.today);
        this.devolutions.forEach(dev => {
          const returnedProductIdx = returnedProducts.findIndex((rp: any) => {
            return rp.sku === dev.sku;
          });
          this.totalDevolutions += parseFloat(dev.retail_price);
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
        this.returnedProducts = returnedProducts;
      });
  }

  public getLosses() {
    this._subscriptionLosses = this._inventoryService.getLossesByDate(this.userRoute, new Date(), new Date())
      .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        map((loss: any) => {
          const product = loss.product;
          product.number_of_piz = loss.number_of_piz;
          return loss.product;
        }),
        toArray()
      ).subscribe(losses => {
        const lossesProducts = [];
        losses.forEach(loss => {
          const lossProductIdx = lossesProducts.findIndex((lp: any) => {
            return loss.sku === lp.sku;
          });
          this.totalLosses += loss.retail_price * loss.number_of_piz;
          if (lossProductIdx > -1) {
            lossesProducts[lossProductIdx]['numberItems'] += loss.number_of_piz;
            lossesProducts[lossProductIdx]['totalPrice'] += loss.retail_price * loss.number_of_piz;
          } else {
            lossesProducts.push({
              ...loss,
              numberItems: loss.number_of_piz,
              totalPrice: loss.retail_price * loss.number_of_piz
            });
          }
        });
        this.dataSourceLosses.data = lossesProducts;
      });
  }

  public openDialogApproveLiquidation() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        text: this.lanLiq.dialogApprove,
        accept: true,
        action: this.lanLiq.approve
      }
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.approveLiquidation();
        }
      }
    );
  }

  public approveLiquidation() {
    this._inventoryService.approveLiquidation(
      this.id,
      this.today,
      this.userRoute,
      this.totalSold,
      (this.totalSold - this.totalDevolutions),
      (this.totalSold - this.totalLosses),
      this.totalDevolutions,
      this.totalLosses
    );
  }

  public getLiquidation() {
    this._subscriptionLiquidation = this._inventoryService.getLiquidation()
      .snapshotChanges()
      .subscribe(liquidations => {
        liquidations.forEach(liquidation => {
          if (liquidation.key === this.userRoute) {
            this.allLiquidations = this._inventoryService.getLiquidationsFromKeys(liquidation.key).valueChanges();
            this.allLiquidations.subscribe(res => {
              res.forEach(element => {
                if (element.date === this.today) {
                  this.existLiquidation = true;
                }
              });
            });
          }
        });
      });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscriptionService) {
      this._subscriptionService.unsubscribe();
    }
    if (this._subscriptionInventories) {
      this._subscriptionInventories.unsubscribe();
    }
    if (this._subscriptionDevolutions) {
      this._subscriptionDevolutions.unsubscribe();
    }
    if (this._subscriptionLosses) {
      this._subscriptionLosses.unsubscribe();
    }
    if (this._subscriptionLiquidation) {
      this._subscriptionLiquidation.unsubscribe();
    }
  }

}
