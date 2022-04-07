import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from '../../data/language';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../users/services/users.service';
import { InventoryService } from './../../services/inventory.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/shared/components/dialog/dialog.component';
import { concatMap, map, take, toArray } from 'rxjs/operators';
import moment from 'moment';


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
  public dateParam: any;
  public user_name: any;
  public loading = true;


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
    // this.getDevolutions();
  }

  public getUser() {
    this.dateParam = this._route.snapshot.queryParams.date;
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this._userService.getUserByRoute(this.id).subscribe((res: any) => {
        console.log(this.id , this.dateParam , res);
        this.dataSource = res;
        this.userRoute = res.route;
        this.getLiquidation();
        this.getInventories();
      });
    });



        //   this.dataSource = res;
        //   // May occurre problem ^
        //   this.userRoute = res.route || this.id;

        //   this.getLiquidation();
        //   this.getInventories();
        //   this.getLosses();
  }

  public getInventories() {
    const wholesaleProducts = [];
    const wholesaleProductsG = [];
    const retailProducts = [];
    // let startDate = new Date;
    // let SD = '';
    // if (this.dateParam !== undefined) {
    //   SD = moment(this.dateParam).format('YYYYMMDD');
    // } else {
    //   SD = moment(startDate).format('YYYYMMDD');
    // }
    // startDate = moment(SD, 'YYYYMMDD').toDate();

    console.log('emtra');

    this._inventoryService.getSales(this.userRoute,  this.dateParam, this.dateParam).then( res => {
      const data = [];
      const keys = Object.keys(res.data);
      keys.forEach( ( element , index ) => {
        const dataAux = res.data[element];
        dataAux.route_name = name;
        data.push(res.data[element]);
      } );
      console.log(data);
    } );
      // .pipe(
      //   take(1),
      //   concatMap(x => x),
      //   concatMap((sale: any) => {
      //     if (!this.dataSource.name) {
      //       this.dataSource = { name: sale.route_name };
      //     }
      //     const keys = Object.keys(sale.Products || {});
      //     const productsArray = keys.map(k => {
      //       const product = sale.Products[k];
      //       if ((product.number_of_items >= product.wholesale_quantity) && (product.number_of_items < product.wholesale_quantityG)) {
      //         product.subtotal = ((product.number_of_items * product.wholesale_price));
      //         this.totalSaleWholesale += product.subtotal;
      //         product.iswholesale = true;
      //       }
      //       if (product.wholesale_quantityG !== '' && (product.number_of_items >= product.wholesale_quantityG)) {
      //         product.subtotal = ((product.number_of_items * product.wholesale_priceG));
      //         this.totalSaleWholesaleG += product.subtotal;
      //         product.iswholesaleG = true;
      //       }
      //       if (product.number_of_items < product.wholesale_quantity) {
      //         product.subtotal = ((product.number_of_items * product.retail_price));
      //         this.totalSaleRetail += product.subtotal;
      //         product.iswholesale = false;
      //         product.iswholesaleG = false;
      //       }
      //       return product;
      //     });
      //     this.totalSold += sale.totalOnSalle;
      //     return productsArray;
      //   }),
      //   toArray()
      // )
      // .subscribe(products => {
      //   products.forEach(product => {
      //     const wholesaleproductIdx = wholesaleProducts.findIndex(wholesaleProduct => wholesaleProduct.sku === product.sku);
      //     const wholesaleproductIdxG = wholesaleProductsG.findIndex(wholesaleProductG => wholesaleProductG.sku === product.sku);
      //     const retailproductIdx = retailProducts.findIndex(retailProduct => retailProduct.sku === product.sku);
      //     if (wholesaleproductIdx > -1 && product.iswholesale) {
      //       wholesaleProducts[wholesaleproductIdx].totalPrice += product.number_of_items * product.wholesale_price;
      //       wholesaleProducts[wholesaleproductIdx].totalItems += product.number_of_items;
      //       wholesaleProducts[wholesaleproductIdx].totalCommission += product.commission;
      //     } else {
      //       if (product.iswholesale === true) {
      //         wholesaleProducts.push({
      //           ...product,
      //           totalPrice: product.number_of_items * product.wholesale_price,
      //           totalItems: product.number_of_items,
      //           totalCommission: product.commission
      //         });
      //       }
      //     }
      //     if (wholesaleproductIdxG > -1 && product.iswholesaleG) {
      //       wholesaleProductsG[wholesaleproductIdxG].totalPrice += product.number_of_items * product.wholesale_priceG;
      //       wholesaleProductsG[wholesaleproductIdxG].totalItems += product.number_of_items;
      //       wholesaleProductsG[wholesaleproductIdxG].totalCommission += product.commission;
      //     } else {
      //       if (product.iswholesaleG === true) {
      //         wholesaleProductsG.push({
      //           ...product,
      //           totalPrice: product.number_of_items * product.wholesale_priceG,
      //           totalItems: product.number_of_items,
      //           totalCommission: product.commission
      //         });
      //       }
      //     }
      //     if (retailproductIdx > -1 && !product.iswholesale && !product.iswholesaleG) {
      //       retailProducts[retailproductIdx].totalPrice += product.number_of_items * product.retail_price;
      //       retailProducts[retailproductIdx].totalItems += product.number_of_items;
      //       retailProducts[retailproductIdx].totalCommission += product.commission;
      //     } else {
      //       if (product.iswholesale === false && product.iswholesaleG === false) {
      //         retailProducts.push({
      //           ...product,
      //           totalPrice: product.number_of_items * product.retail_price,
      //           totalItems: product.number_of_items,
      //           totalCommission: product.commission
      //         });
      //       }
      //     }
      //   });

        // this.dataSourceTable.data = retailProducts;
        // this.dataSourceWholesaleTable.data = wholesaleProducts;
        // this.dataSourceWholesaleTableG.data = wholesaleProductsG;
        // this.loading = false;

     // });
  }


  public getDevolutions() {
    const returnedProducts = new Array();
    this._inventoryService.getDevolutionsL().subscribe(
      res => {
        console.log(res);
        this.devolutions = res;
        this.devolutions = this.devolutions
          .map(d => {
            console.log( d );
            d.date_of_assignment = this._datePipe.transform(d.date_of_assignment, 'yyyy-MM-dd');
            return d;
          })
          .filter(d => {
            if (this.dateParam !== undefined) {
              return d.route === this.id && d.date_of_assignment === this.dateParam;
            } else {
              return d.route === this.id && d.date_of_assignment === this.today;
            }
          });

          console.log(this.devolutions);

          this.devolutions.forEach(dev => {

          const returnedProductIdx = returnedProducts.findIndex((rp: any) => {
            return rp.sku === dev.sku;
          });
          if (returnedProductIdx > -1) {
            returnedProducts[returnedProductIdx]['numberItems'] += parseFloat(returnedProducts[returnedProductIdx].number_of_items);
            returnedProducts[returnedProductIdx]['totalPrice'] =
              parseFloat(returnedProducts[returnedProductIdx].numberItems) * parseFloat(dev.retail_price);
          } else {
            returnedProducts.push({
              ...dev,
              numberItems: parseFloat(dev.number_of_items),
              totalPrice: parseFloat(dev.number_of_items) * parseFloat(dev.retail_price)
            });
          }
        });
        returnedProducts.map(devo => {
          this.totalDevolutions += devo.totalPrice;
        });
        this.returnedProducts = returnedProducts;
      });
  }

  public getLosses() {
    let startDate = new Date;
    let SD = '';
    if (this.dateParam !== undefined) {
      SD = moment(this.dateParam).format('YYYYMMDD');
    } else {
      SD = moment(startDate).format('YYYYMMDD');
    }
    startDate = moment(SD, 'YYYYMMDD').toDate();
    this._inventoryService.getLossesByDate(this.userRoute, startDate, startDate)
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
      this.dataSource.id,
      this.dataSource.name,
      this.today,
      this.userRoute,
      this.totalSold,
      (this.totalSold - this.totalDevolutions),
      (this.totalSold + this.totalLosses),
      this.totalDevolutions,
      this.totalLosses
    );
  }

  public getLiquidation() {
    this._inventoryService.getLiquidation( this.id , this.dateParam , this.dateParam  ).then(res => {
      const data = [];
      const keys = Object.keys(res.data);
      keys.forEach( ( element , index ) => {
        const dataAux = res.data[element];
        dataAux.route_name = name;
        data.push(res.data[element]);
      } );
      console.log(data);

      if ( data.length > 0 ) {
        this.user_name = data[0].user_name;
      }
      console.log(this.user_name);

      // res.forEach((element: any ) => {
      //   if (this.dateParam !== undefined) {
      //     this.today = this.dateParam;
      //   }
      //   if (element.date === this.today) {
      //     this.existLiquidation = true;
      //     this.user_name = element.user_name || this.dataSource.name;
      //   } else {
      //     this.user_name = element.user_name || this.dataSource.name;
      //   }
      // });
    });
  }

  ngOnDestroy() {
    // if (this._subscription) {
    //   this._subscription.unsubscribe();
    // }
    // if (this._subscriptionService) {
    //   this._subscriptionService.unsubscribe();
    // }
    // if (this._subscriptionInventories) {
    //   this._subscriptionInventories.unsubscribe();
    // }
    // if (this._subscriptionDevolutions) {
    //   this._subscriptionDevolutions.unsubscribe();
    // }
    // if (this._subscriptionLosses) {
    //   this._subscriptionLosses.unsubscribe();
    // }
    // if (this._subscriptionLiquidation) {
    //   this._subscriptionLiquidation.unsubscribe();
    // }
  }

}
