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

import { jsPDF } from 'jspdf';

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
  public totalCredit = 0;
  public colletCredit = 0;
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
  public saleDate: any;
  public user_name: any;
  public loading = true;
  public clients: any;
  public collection: 0;
  public cash: 0;
  public difference: 0;
  public salesReturns = 0;


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


      keys.forEach(( element , index) => {

        if ( res.data[element].pay_whit_credit === true && !this.existLiquidation ) {
          const numAux = res.data[element].pay_whit_credit_amount.slice(3 , -3);
          this.totalCredit = (parseFloat(numAux.replace(',', ''))) + this.totalCredit ;
        }
        if ( res.data[element].collet_credit !== undefined ) {
          this.colletCredit = res.data[element].collet_credit + this.colletCredit ;
        }
      } );


      dataItems.forEach(( items ) => {
        if (
          items.wholesale_quantityG !== '' &&
          items.number_of_items >= items.wholesale_quantity &&
          items.number_of_items < items.wholesale_quantityG
        ) {
          let newsku = true;
          wholesaleProducts.find( function (elementAux: any , index) {
            if (items.sku === elementAux.sku ) {
              wholesaleProducts[index].number_of_items =  wholesaleProducts[index].number_of_items + items.number_of_items;

              newsku = false;
            }
          });
          if (newsku) {
            wholesaleProducts.push(items);
          }
          this.totalSaleWholesale = this.totalSaleWholesale +  (items.number_of_items *  parseFloat(items.wholesale_price));
        }
        if (
          items.wholesale_quantityG !== '' &&
          items.number_of_items >= items.wholesale_quantityG
        ) {
          let newsku = true;
          wholesaleProductsG.find( function (elementAux: any , index) {
            if (items.sku === elementAux.sku ) {
              wholesaleProductsG[index].number_of_items =  wholesaleProductsG[index].number_of_items + items.number_of_items;

              newsku = false;
            }
          });
          if (newsku) {
            wholesaleProductsG.push(items);
          }
          this.totalSaleWholesaleG =  this.totalSaleWholesaleG  + (items.number_of_items *  parseFloat(items.wholesale_priceG));
        }
        if (items.number_of_items < items.wholesale_quantity) {
          let newsku = true;
          retailProducts.find( function (elementAux: any , index) {
            if (items.sku === elementAux.sku ) {
              retailProducts[index].number_of_items =  retailProducts[index].number_of_items + items.number_of_items;

              newsku = false;
            }
          });
          if (newsku) {
          retailProducts.push(items);
          }
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
          this.getPdf();
          this.dialogRef.close();
        }
      }
    );
  }

  public approveLiquidation() {
    this.totalSold = this.totalSaleRetail + this.totalSaleWholesale + this.totalSaleWholesaleG;
    this._inventoryService.approveLiquidation(
      this.dataSource.id,
      this.dataSource.name,
      this.today,
      this.userRoute,
      this.totalSold,
      (this.totalSaleRetail + this.totalSaleWholesale + this.totalSaleWholesaleG  - this.totalDevolutions - this.totalCredit
      + this.totalLosses + this.collection - this.difference - this.cash + this.colletCredit),
      (this.totalSaleRetail + this.totalSaleWholesale + this.totalSaleWholesaleG  - this.totalDevolutions - this.totalCredit
      + this.totalLosses + this.collection - this.difference + this.colletCredit),
      this.totalDevolutions,
      this.totalLosses,
      this.totalCredit,
      this.collection,
      this.cash,
      this.difference
    );
  }


  public getLiquidation() {
    this._inventoryService.getLiquidation( this.id , this.dateParam , this.dateParam  ).then((res: any ) => {

      if (Object.keys( res.data).length === 0) {

        // this.dialogRef.close();
      }
      const data = [];
      const keys = Object.keys(res.data);
      keys.forEach( ( element , index ) => {
        const dataAux = res.data[element];
        dataAux.route_name = name;
        data.push(res.data[element]);

      } );

      if ( data.length > 0 ) {
        this.user_name = data[0].user_name;
        this.saleDate = data[0].date;
      }
      const inter = Object.keys(res.data);
      if ( this.existLiquidation === true ) {
        this.collection = res.data[inter[0]].collection ? res.data[inter[0]].collection : 0;
        this.totalCredit = res.data[inter[0]].totalCredit ? res.data[inter[0]].totalCredit : 0;
        this.cash = res.data[inter[0]].cash ? res.data[inter[0]].cash : 0;
        this.difference = res.data[inter[0]].difference ? res.data[inter[0]].difference : 0;
      }

    });
  }

  public getClient() {
    this._clientService.getAllClients().subscribe(( res: any) => {
      const dataClientAux = {};
      res.forEach( ( elementAUx , index ) => {
        dataClientAux[elementAUx.id] = elementAUx;
        if ( index + 1 === res.length ) {
          localStorage.setItem( 'clients' , JSON.stringify(dataClientAux) );
          this.clients = dataClientAux;

        }
      });
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
  }




  public createHeaders(keys) {
    const result = [];
    for ( let  i = 0; i < keys.length; i += 1) {
      if ( i === 0 ) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 130,
          height: 10,
          align: 'left',
          padding: 0,
        });
      }
      if ( i === 1 ) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 40,
          height: 10,
          align: 'left',
          padding: 0,
        });
      }
      if ( i === 2 ) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 30,
          height: 10,
          align: 'left',
          padding: 0,
        });
      }
      if ( i === 3 ) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 27,
          height: 10,
          align: 'left',
          padding: 0,
        });
      }
      if ( i === 4 ) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 35,
          height: 10,
          align: 'left',
          padding: 0,
        });
      }
      if ( i === 5 ) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 35,
          height: 10,
          align: 'left',
          padding: 0,
        });
      }

    }
    return result;
  }

  public async getPdf() {
    let pagePdf = 0;
    let linePdf = 0;
    const doc = new jsPDF();
    doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text( `Fecha: ${this.saleDate}` , 10, 25);
    doc.text( `Liquidación: ${ this.data.nameRute} - ${this.user_name}` , 10, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text( `Ventas del día: $${(this.totalSaleRetail + this.totalSaleWholesale + this.totalSaleWholesaleG).toFixed(2)}`, 10, 40);
    doc.text( `Total devolución: $${ this.totalDevolutions.toFixed(2)}`, 10, 45);
    doc.text( `Credito: $${ this.totalCredit.toFixed(2) }`, 10, 50);
    doc.text( `Credito cobrado: $${ this.colletCredit.toFixed(2) }`, 10, 55);
    doc.text( `Total merma: $${ this.totalLosses.toFixed(2) }`, 10, 60);
    doc.text( `Cobranza: $${ this.collection.toFixed(2) }`, 10, 65);
    doc.text( `Diferencia: $${ this.difference.toFixed(2) }`, 10, 70);
    doc.text( `Total: $${( this.totalSaleRetail + this.totalSaleWholesale + this.totalSaleWholesaleG  - this.totalDevolutions - this.totalCredit + this.totalLosses + this.collection - this.difference + this.colletCredit).toFixed(2) }`, 10, 75);
    doc.text( `Efectivo: $${ this.cash.toFixed(2) }`, 10, 80);
    doc.text( `Saldo: $${ (this.totalSaleRetail + this.totalSaleWholesale + this.totalSaleWholesaleG  - this.totalDevolutions - this.totalCredit + this.totalLosses + this.collection - this.difference - this.cash + this.colletCredit).toFixed(2) }`, 10, 85);

    if (this.dataSourceTable.data.length !== 0) {
      const table1: any = [[]];
      await this.dataSourceTable.data.forEach((element: any, index: any) => {
        if (pagePdf === 0 && linePdf <= 31) {
          table1[0].push({
            Producto: ` ${element.name} `,
            Marca: element.brand,
            Vendido: `${element.number_of_items}`,
            Precio: '$' + element.retail_price,
            Total: '$' + parseFloat(`${parseFloat(element.number_of_items) * parseFloat(element.retail_price)}`).toFixed(2),
          });
        }
        if (pagePdf > 0 && linePdf <= 39) {
          table1[table1.length - 1].push({
            Producto: ` ${element.name} `,
            Marca: element.brand,
            Vendido: `${element.number_of_items}`,
            Precio: '$' + element.retail_price,
            Total: '$' + parseFloat(`${parseFloat(element.number_of_items) * parseFloat(element.retail_price)}`).toFixed(2),
          });
        }
        linePdf++;
        if (pagePdf === 0 && linePdf === 32 && index < this.dataSourceTable.data.length - 1) {
          linePdf = 0;
          pagePdf++;
          table1.push([]);
        }
        if (pagePdf > 0 && linePdf === 40 && index < this.dataSourceTable.data.length - 1) {
          linePdf = 0;
          pagePdf++;
          table1.push([]);
        }
        if (index === this.dataSourceTable.data.length - 1) {
          table1.forEach((elementTable, indexTable) => {
            if (indexTable === 0) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(16);
              doc.text('Ventas Minoristas', 10, 95);
              doc.table(6, 100, table1[indexTable], this.createHeaders([
                'Producto',
                'Marca',
                'Vendido',
                'Precio',
                'Total',
              ]), { fontSize: 8, padding: 1.2, printHeaders: true });
            } else {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(16);
              doc.addPage('a4', 'p');
              doc.addImage('../../../../../../../assets/images/logo_sanper.png', 'PNG', 10, 10, 50, 10);
              doc.text('Ventas Minoristas', 10, 30);
              doc.table(6, 35, table1[indexTable], this.createHeaders([
                'Producto',
                'Marca',
                'Vendido',
                'Precio',
                'Total',
              ]), { fontSize: 8, padding: 1.2, printHeaders: true });
            }
          });
        }
      });
    }

    if (this.dataSourceDevolutions.data.length !== 0) {
      const table2: any = [[]];
      const initialHeight = linePdf;
      let space = 39;
      let indexTab = 0;
      linePdf = linePdf  + 3;
      if ( pagePdf === 0 ) {
        space = 32 - linePdf;
      }
      if ( pagePdf > 0 ) {
        space = 38 - linePdf;
      }
      if (  32 - linePdf < 15  && pagePdf === 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      if (  39 - linePdf < 15  && pagePdf > 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      await this.dataSourceDevolutions.data.forEach(( element2: any , index: any) => {
          table2[ table2.length - 1 ].push({
            Producto: ` ${element2.name}  `,
            Marca: element2.brand,
            Vendido: `${element2.number_of_items}`,
            Precio: '$' + element2.retail_price,
            Total: '$' + parseFloat(`${ parseFloat(element2.number_of_items) * parseFloat(element2.retail_price)}`).toFixed(2),
          });
        indexTab++;
        linePdf ++;
        if (indexTab === space || this.dataSourceDevolutions.data.length - 1 === index ) {
          if ( space < 39 ) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            console.log(( pagePdf === 0  ? 100 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )));
            console.log('devP' + pagePdf);
            doc.text( 'Devoluciones' , 10, ( pagePdf === 0  ? 95 + ((initialHeight + 4) * 6.2 ) : 45 + (initialHeight * 6.2 )));
            doc.table( 6 , ( pagePdf === 0  ? 100 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )),
            table2[table2.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Vendido',
              'Precio',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true  }   );
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.addPage('a4', 'p' , );
            doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
            doc.text( 'Devoluciones' , 10, 30);
            doc.table( 6 , 35, table2[table2.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Vendido',
              'Precio',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true   });
          }
          if ( indexTab === space ) {
            space = 39;
            pagePdf ++;
            indexTab = 0;
            table2.push([]);
          }
        }
      });
    }

    if (this.dataSourceWholesaleTable.data.length !== 0) {
      const table3: any = [[]];
      const initialHeight = linePdf;
      let space = 39;
      let indexTab = 0;
      linePdf = linePdf  + 3;
      if ( pagePdf === 0 ) {
        space = 32 - linePdf;
      }
      if ( pagePdf > 0 ) {
        space = 38 - linePdf;
      }
      if (  32 - linePdf < 15  && pagePdf === 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      if (  39 - linePdf < 15  && pagePdf > 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }

      await this.dataSourceWholesaleTable.data.forEach(( element2: any , index: any) => {
          table3[ table3.length - 1 ].push({
            Producto: ` ${element2.name} `,
            Marca: element2.brand,
            Vendido: `${element2.number_of_items}`,
            Precio: '$' + element2.retail_price,
            Total: '$' + parseFloat(`${ parseFloat(element2.number_of_items) * parseFloat(element2.retail_price)}`).toFixed(2),
          });
        indexTab++;
        linePdf ++;
        if (indexTab === space || this.dataSourceWholesaleTable.data.length - 1 === index ) {
          if ( space < 39 ) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            console.log(initialHeight);
            console.log(pagePdf);
            console.log(( pagePdf === 0  ? 100 + (initialHeight * 6.2 ) : 45 + (initialHeight * 6.2 )));
            doc.text( 'Ventas Mayorista' , 10, (pagePdf === 0  ? 95 + ((initialHeight + 4) * 6.2 ) : 45 + (initialHeight * 6.2 )));
            doc.table( 6 , ( pagePdf === 0  ? 100 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )),
             table3[table3.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Vendido',
              'Precio',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true  }   );
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.addPage('a4', 'p' , );
            doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
            doc.text( 'Ventas Mayorista' , 10, 30);
            doc.table( 6 , 35, table3[table3.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Vendido',
              'Precio',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true   });
          }
          if ( indexTab === space ) {
            space = 39;
            pagePdf ++;
            indexTab = 0;
            table3.push([]);
          }
        }
      });
    }

    if (this.dataSourceLosses.data.length !== 0) {
      const table4: any = [[]];
      const initialHeight = linePdf;
      let space = 39;
      let indexTab = 0;
      linePdf = linePdf  + 3;
      if ( pagePdf === 0 ) {
        space = 32 - linePdf;
      }
      if ( pagePdf > 0 ) {
        space = 38 - linePdf;
      }
      if (  32 - linePdf < 15  && pagePdf === 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      if (  39 - linePdf < 15  && pagePdf > 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      await this.dataSourceLosses.data.forEach(( element2: any , index: any) => {
          table4[ table4.length - 1 ].push({
            Producto: ` ${element2.product.name}  `,
            Marca: element2.product.brand,
            Precio: '$' + element2.product.wholesale_price,
            Mermas: ` ${element2.number_of_piz}`,
            Total: '$' + parseFloat(`${ parseFloat(element2.number_of_piz) * parseFloat(element2.product.wholesale_price)}`).toFixed(2),
          });
        indexTab++;
        linePdf ++;
        if (indexTab === space || this.dataSourceLosses.data.length - 1 === index ) {
          if ( space < 39 ) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            console.log(( pagePdf === 0  ? 100 + (initialHeight * 6.2 ) : 50 + (initialHeight * 6.2 )));
            doc.text( 'Mermas' , 10, pagePdf === 0  ? 95 + ((initialHeight + 4) * 6.2 ) : 45 + (initialHeight * 6.2 ));
            doc.table( 6 , ( pagePdf === 0  ? 100 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )) ,
             table4[table4.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Precio',
              'Mermas',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true  }   );
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.addPage('a4', 'p' , );
            doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
            doc.text( 'Mermas' , 10, 30);
            doc.table( 6 , 35, table4[table4.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Precio',
              'Mermas',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true   });
          }
          if ( indexTab === space ) {
            space = 39;
            pagePdf ++;
            indexTab = 0;
            table4.push([]);
          }
        }
      });
    }

    if (this.dataSourceWholesaleTableG.data.length !== 0) {
      console.log(linePdf);
      const table5: any = [[]];
      const initialHeight = linePdf;
      let space = 39;
      let indexTab = 0;
      linePdf = linePdf  + 3;
      if ( pagePdf === 0 ) {
        space = 32 - linePdf;
      }
      if ( pagePdf > 0 ) {
        space = 38 - linePdf;
      }
      if (  32 - linePdf < 15  && pagePdf === 0 ) {
        console.log(32 - linePdf);
        linePdf = 0;
        pagePdf ++;
        space = 39;
        console.log('linePdf');
      }
      if (  39 - linePdf < 15  && pagePdf > 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }

      await this.dataSourceWholesaleTableG.data.forEach(( element2: any , index: any) => {
          table5[ table5.length - 1 ].push({
            Producto: ` ${element2.name}  `,
            Marca: element2.brand,
            Vendido: `${parseFloat(element2.number_of_items)}`,
            Precio: '$' + element2.wholesale_priceG,
            Total: '$' + parseFloat(`${ parseFloat(element2.number_of_items) * parseFloat(element2.wholesale_priceG)}`).toFixed(2),
          });
        indexTab++;
        linePdf ++;
        if (indexTab === space || this.dataSourceWholesaleTableG.data.length - 1 === index ) {
          if ( space < 39 ) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.text( 'Mermas' , 10, pagePdf === 0  ? 95 + ((initialHeight + 4) * 6.2 ) : 45 + (initialHeight * 6.2 ));
            doc.table( 6 , ( pagePdf === 0  ? 100 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )) ,
             table5[table5.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Vendido',
              'Precio',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true  }   );
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.addPage('a4', 'p' , );
            doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
            doc.text( 'Mermas' , 10, 30);
            doc.table( 6 , 35, table5[table5.length - 1], this.createHeaders([
              'Producto',
              'Marca',
              'Vendido',
              'Precio',
              'Total',
            ]), { fontSize: 8 , padding: 1.2 , printHeaders: true   });
          }
          if ( indexTab === space ) {
            space = 39;
            pagePdf ++;
            indexTab = 0;
            table5.push([]);
          }
        }
      });
    }
    doc.save( `Ticket-Nombre.pdf` );
  }
}
