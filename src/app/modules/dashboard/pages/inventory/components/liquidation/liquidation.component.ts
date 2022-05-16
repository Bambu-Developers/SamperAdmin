import { element } from 'protractor';
import { Component, OnInit, OnDestroy , Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from '../../data/language';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../users/services/users.service';
import { InventoryService } from './../../services/inventory.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
  public clients: any;
  public collection: 0;


  constructor(
    private _route: ActivatedRoute,
    private _userService: UsersService,
    private _inventoryService: InventoryService,
    private _datePipe: DatePipe,
    private _dialog: MatDialog,
    private _clientService: ClientsService,
    public dialogRef: MatDialogRef<LiquidationComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.today = this._datePipe.transform(this.today, 'yyyy-MM-dd');
  }

  ngOnInit() {
    this.getUser();
    this.getClient();
  }

  public getUser() {
    this.dateParam = this.data.date;
    this.id = this.data.route;
    this.existLiquidation = !this.data.existLiquidation;
    this._userService.getUserByRoute(this.id).subscribe((res: any) => {

      this.dataSource = res;
      this.userRoute = res.route;
      this.getLiquidation();
      this.getInventories();
      this.getLosses( this.dateParam , this.userRoute );
    });
  }

  public getInventories() {
    const wholesaleProducts = [];
    const wholesaleProductsG = [];
    const retailProducts = [];


    this._inventoryService.getSales(this.userRoute,  this.dateParam, this.dateParam).then(async (res) => {
      const data = [];
      const keys = Object.keys(res.data);
      keys.forEach( ( element , index ) => {
        data.push(res.data[element]);
      } );
      const dataItems = [];

      for await (const iterator of data) {
        if (iterator.Devolutions) {
          const evolutionKeys = Object.keys(iterator.Devolutions);
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
    });
  }

  public getLosses( date , route ) {
      this._inventoryService.getLosses( date , route ).then( ress => {
        const keys = Object.keys(ress.data);
        keys.forEach( ( element , index ) => {
          this.dataSourceLosses.data.push(ress.data[element]);
          this.totalLosses = (ress.data[element].number_of_piz * ress.data[element].product.retail_price ) + this.totalLosses;
        } );
      } );
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
    });
  }

  public getClient() {
    const dataAux = localStorage.getItem('clients');
    this.clients = JSON.parse(dataAux);
  }

  public close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
  }

}
