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
import { ClientsService } from '../../../clients/services/clients.service';


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
  public displayedColumns = ['sku', 'image', 'name', 'quantity', 'customer', 'brand', 'subtotal'];
  public displayedColumnsDevolutions = ['sku', 'image', 'name', 'quantity', 'customer', 'brand', 'subtotal'];
  public displayedColumnsLosses = ['sku', 'image', 'name', 'quantity', 'customer', 'brand', 'subtotal'];
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
    private _clientService: ClientsService,
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


    this._inventoryService.getSales(this.userRoute,  this.dateParam, this.dateParam).then(async (res) => {
      console.log(res);
      const data = [];
      const keys = Object.keys(res.data);
      keys.forEach( ( element , index ) => {
        data.push(res.data[element]);
      } );
      console.log(data);
      const dataItems = [];



      for await (const iterator of data) {

        if (iterator.Devolutions) {

          const evolutionKeys = Object.keys(iterator.Devolutions);
          console.log('entra', iterator , evolutionKeys  );
          this.getDevolutions( iterator , evolutionKeys );
        }

        if ( iterator.Products ) {

          const keysItems = Object.keys(iterator.Products);
          keysItems.forEach( ( element2 , index2 ) => {
            iterator.Products[element2].customer =  iterator.customerId;
            dataItems.push(iterator.Products[element2]);
          } );

        }
      }

      dataItems.forEach(( items ) => {
        if (
          items.wholesale_quantityG !== '' &&
          items.number_of_items >= items.wholesale_quantity &&
          items.number_of_items < items.wholesale_quantityG
        ) {
          wholesaleProducts.push(items);
          this.totalSaleWholesale = this.totalSaleWholesale +  (items.number_of_items *  parseFloat(items.wholesale_price));
        }
        if (
          items.wholesale_quantityG !== '' &&
          items.number_of_items >= items.wholesale_quantityG
        ) {
          wholesaleProductsG.push(items);
          this.totalSaleWholesaleG =  this.totalSaleWholesaleG  + (items.number_of_items *  parseFloat(items.wholesale_priceG));
        }
        if (items.number_of_items < items.wholesale_quantity) {
          retailProducts.push(items);

          this.totalSaleRetail =  this.totalSaleRetail + (items.number_of_items * parseFloat(items.retail_price));
        }
      });

      this.dataSourceTable.data = retailProducts;
      this.dataSourceWholesaleTable.data = wholesaleProducts;
      this.dataSourceWholesaleTableG.data = wholesaleProductsG;
      this.loading = false;



    } );
  }

  public getDevolutions( data, evolutionKeys) {
    this.totalDevolutions = data.totalForDevolution;
    evolutionKeys.forEach(( element , index ) => {
      this.dataSourceDevolutions.data.push(data.Devolutions[element]);
      console.log(data.Devolutions[element]);
    });
  }


  // public getDevolutions() {
  //   const returnedProducts = new Array();
  //   this._inventoryService.getDevolutionsL().subscribe(
  //     res => {
  //       ;
  //       this.devolutions = res;
  //       this.devolutions = this.devolutions
  //         .map(d => {

  //           d.date_of_assignment = this._datePipe.transform(d.date_of_assignment, 'yyyy-MM-dd');
  //           return d;
  //         })
  //         .filter(d => {
  //           if (this.dateParam !== undefined) {
  //             return d.route === this.id && d.date_of_assignment === this.dateParam;
  //           } else {
  //             return d.route === this.id && d.date_of_assignment === this.today;
  //           }
  //         });

  //         console.log(this.devolutions);

  //         this.devolutions.forEach(dev => {

  //         const returnedProductIdx = returnedProducts.findIndex((rp: any) => {
  //           return rp.sku === dev.sku;
  //         });
  //         if (returnedProductIdx > -1) {
  //           returnedProducts[returnedProductIdx]['numberItems'] += parseFloat(returnedProducts[returnedProductIdx].number_of_items);
  //           returnedProducts[returnedProductIdx]['totalPrice'] =
  //             parseFloat(returnedProducts[returnedProductIdx].numberItems) * parseFloat(dev.retail_price);
  //         } else {
  //           returnedProducts.push({
  //             ...dev,
  //             numberItems: parseFloat(dev.number_of_items),
  //             totalPrice: parseFloat(dev.number_of_items) * parseFloat(dev.retail_price)
  //           });
  //         }
  //       });
  //       returnedProducts.map(devo => {
  //         this.totalDevolutions += devo.totalPrice;
  //       });
  //       this.returnedProducts = returnedProducts;
  //     });
  // }

  public getLosses() {


      const lossesProducts = [];
      this.dataSourceLosses.data = lossesProducts;
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

      if ( data.length > 0 ) {
        this.user_name = data[0].user_name;
      }


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
  }

}
