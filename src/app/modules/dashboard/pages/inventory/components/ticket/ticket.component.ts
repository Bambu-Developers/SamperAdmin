
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { InventoryService } from './../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { Component, OnInit, OnDestroy , Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { take, concatMap, toArray, filter, map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})

export class TicketComponent implements OnInit, OnDestroy {
  public lanInv = INVENTORY_LANGUAGE;
  public dataSourceRetailTable = new MatTableDataSource();
  public dataSourceWholesaleTable = new MatTableDataSource();
  public dataSourceWholesaleTableG = new MatTableDataSource();
  public dataSourceReturnedTable = new MatTableDataSource();
  public dataSourceLossesTable = new MatTableDataSource();
  public displayedRetailColumns = [
    'image',
    'name',
    'route',
    'brand',
    'quantity',
    'price',
    'total',
  ];
  public displayedColumnsReturned = [
    'sku',
    'image',
    'name',
    'quantity',
    'brand',
    'total',
  ];
  public displayedColumnsDevolutions =[
    'sku',
    'image',
    'name',
    'quantity',
    'brand',
    'total',
  ];
  public displayedColumnsLosses = [
    'sku',
    'image',
    'name',
    'quantity',
    'brand',
    'total',
  ];
  public totalSold = 0;
  public totalReturned = 0;
  public date: Date;
  public ticket: any;
  public client: any;
  public clientID: any;
  public credit: any;
  public route_name = '';
  public loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _inventoryService: InventoryService,
    private _clientService: ClientsService,
    public dialogRef: MatDialogRef<TicketComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.getParams();
  }

  close(): void {
    this.dialogRef.close();
  }

  public getParams() {
    // const params = this._route.snapshot.queryParams;
    this.ticket = this.data.ticket;
    this.clientID = this.data.client;
    const routeId = this.data.route;
    this.getTicketData(routeId, this.ticket);
    this.getClient(this.clientID);
  }

  public getDevolutions( data, evolutionKeys) {
    this.totalReturned = data.totalForDevolution;
    const dataDevolutions = [];
    evolutionKeys.forEach(( element , index ) => {
      dataDevolutions.push(data.Devolutions[element]);
      if ( index + 1 === evolutionKeys.length ) {
        this.dataSourceReturnedTable.data = dataDevolutions;
      }
    });
  }

  public getTicketData(route, ticket) {
    this._inventoryService.getSaleByTicket(route, ticket).then(
      ress => {
        this.credit = ress.data.pay_whit_credit ? ress.data.pay_whit_credit_amount : 0;
        this.clientID = ress.data.customerId;
        this.date = ress.data.date;
        this.route_name = ress.data.route_name;
        this.totalSold = ress.data.totalOnSalle;
        const productKeys = Object.keys(ress.data.Products);
        const dataSales = [];
        const retailProducts = [];
        const wholesaleProducts = [];
        const wholesaleProductsG = [];

        if (ress.data.Devolutions) {
          const evolutionKeys = Object.keys(ress.data.Devolutions);
          this.getDevolutions( ress.data , evolutionKeys );
        }

        productKeys.forEach(( element , index ) => {
          dataSales.push(ress.data.Products[element]);

          if ( index + 1 === productKeys.length ) {
            dataSales.forEach( (product: any) => {
              product = { ...product, route_name: this.route_name };
              if (
                product.wholesale_quantityG !== '' &&
                product.number_of_items >= product.wholesale_quantity &&
                product.number_of_items < product.wholesale_quantityG
              ) {
                wholesaleProducts.push(product);
              }
              if (
                product.wholesale_quantityG !== '' &&
                product.number_of_items >= product.wholesale_quantityG
              ) {
                wholesaleProductsG.push(product);
              }
              if (product.number_of_items < product.wholesale_quantity) {
                retailProducts.push(product);
              }
            });
            this.dataSourceRetailTable.data = retailProducts;
            this.dataSourceWholesaleTable.data = wholesaleProducts;
            this.dataSourceWholesaleTableG.data = wholesaleProductsG;
          }
        });
      }
    );
  }

  public getClient(clientID) {
    const dataClient = localStorage.getItem('clients');
    this.client = JSON.parse(dataClient)[clientID];
    if (  !this.client ) {
      this._clientService.getAllClients().subscribe(( res: any) => {
        const dataClientAux = {};
        res.forEach( ( element , index ) => {
          dataClientAux[element.id] = element;
          if ( index + 1 === res.length ) {
            localStorage.setItem( 'clients' , JSON.stringify(dataClientAux) );
            this.client = dataClientAux[clientID];
          }
        });
      });
    }

    this.loading = false;
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
          width: 88,
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
          width: 40,
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

  public getPdf() {
    let tableStart = false;
    const doc = new jsPDF();
    doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text( `Ticket: ${this.ticket}` , 10, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text( `Total vendido: $${this.totalSold.toFixed(2) }`, 10, 35);
    doc.text( `Total en devoluciones: $${this.totalReturned}`, 10, 40);
    doc.text( `Cliente: ${ this.client !== undefined ? this.client.name : this.clientID } - ${this.route_name}`, 10, 50);
    doc.text( `Tienda: ${ this.client !== undefined ? this.client.shop_name : this.clientID }`, 10, 55);
    doc.text( `Teléfono: ${ this.client !== undefined ? this.client.phone : 'Sin teléfono' }`, 10, 60);
    const headers = this.createHeaders([
      'Producto',
      'Ruta',
      'Marca',
      'Vendido',
      'Precio',
      'Total',
    ]);

    if (this.dataSourceRetailTable.data.length !== 0) {
      const table1: any = [];

      this.dataSourceRetailTable.data.forEach((element: any) => {
        table1.push({
          Producto: ` ${element.name} `,
          Ruta: this.route_name,
          Marca: element.brand,
          Vendido: `${element.number_of_items}`,
          Precio: '$' + element.retail_price,
          Total: '$' + parseFloat(`${ parseFloat(element.number_of_items) * parseFloat(element.retail_price)}`).toFixed(2),
        });
      });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      if ( !tableStart ) {
        doc.text( 'Ventas Minoristas' , 10, 72);
        doc.table( 6 , 75, table1, headers,  { fontSize: 8 , padding: .8 } );
      } else {
        doc.addPage('a4', 'p' , );
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Ventas Minoristas' , 10, 30);
        doc.table( 6 , 35, table1, headers, { fontSize: 8 , padding: .8   });
      }
      tableStart = true;
    }

    if (this.dataSourceReturnedTable.data.length !== 0) {
      const table2: any = [];
      this.dataSourceReturnedTable.data.forEach((element: any) => {
        table2.push({
          Producto: ` ${element.name}  `,
          Ruta: this.route_name,
          Marca: element.brand,
          Vendido: `${element.number_of_items}`,
          Precio: '$' + element.retail_price,
          Total: '$' + parseFloat(`${ parseFloat(element.number_of_items) * parseFloat(element.retail_price)}`).toFixed(2),
        });
      });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      if ( !tableStart ) {
        doc.text( 'Devoluciones' , 10, 90);
        doc.table(6, 95, table2, headers, {fontSize: 7 , padding: .8 });
      } else {
        doc.addPage('a4', 'p');
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Devoluciones' , 10, 30);
        doc.table(6, 35, table2, headers, {fontSize: 7 , padding: .8 });
      }
      tableStart = true;

    }

    if (this.dataSourceWholesaleTable.data.length !== 0) {
      const table3: any = [];
      this.dataSourceWholesaleTable.data.forEach((element: any) => {
        table3.push({
          Producto: ` ${element.name}  `,
          Ruta: this.route_name,
          Marca: element.brand,
          Vendido: `${element.number_of_items}`,
          Precio: '$' + element.wholesale_price,
          Total: '$' + parseFloat(`${ parseFloat(element.number_of_items) * parseFloat(element.wholesale_price)}`).toFixed(2),
        });
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      if ( !tableStart ) {
        doc.text( 'Ventas Mayorista' , 10, 90);
        doc.table(6, 95, table3, headers, {fontSize: 7 , padding: .8 });
      } else {
        doc.addPage('a4', 'p');
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Ventas Mayorista' , 10, 30);
        doc.table(6, 35, table3, headers, {fontSize: 7 , padding: .8 });
      }
      tableStart = true;
    }

    if (this.dataSourceWholesaleTableG.data.length !== 0) {
      const table4: any = [];
      this.dataSourceWholesaleTableG.data.forEach((element: any) => {
        table4.push({
          Producto: ` ${element.name}  `,
          Ruta: this.route_name,
          Marca: element.brand,
          Vendido: element.number_of_items,
          Precio: '$' + element.wholesale_priceG,
          Total: '$' + parseFloat(`${ parseFloat(element.number_of_items) * parseFloat(element.wholesale_priceG)}`).toFixed(2),
        });
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      if ( !tableStart ) {
        doc.text( 'Ventas Gran Mayoreo' , 10, 90);
        doc.table(6, 95, table4, headers, {fontSize: 7 , padding: .8 });
      } else {
        doc.addPage('a4', 'p');
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Ventas Gran Mayoreo' , 10, 30);
        doc.table(6, 35, table4, headers, {fontSize: 7 , padding: .8 });
      }
      tableStart = true;
    }

    doc.save( `Ticket-${this.ticket}.pdf` );
  }

}
