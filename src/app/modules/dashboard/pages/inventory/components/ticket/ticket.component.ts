
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { InventoryService } from './../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { take, concatMap, toArray, filter, map } from 'rxjs/operators';

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
  public route_name = '';
  public loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _inventoryService: InventoryService,
    private _clientService: ClientsService
  ) {}

  ngOnInit() {
    this.getParams();
  }

  public getParams() {
    const params = this._route.snapshot.queryParams;
    this.ticket = params['ticket'];
    this.clientID = params['client'];
    const routeId = params['route'];
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
        console.log(dataDevolutions , this.dataSourceReturnedTable.data );
      }
    });
  }

  public getTicketData(route, ticket) {
    this._inventoryService.getSaleByTicket(route, ticket).then(
      ress => {
        console.log(ress.data);
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
        console.log(dataSales);
      }
    );
  }

  public getClient(clientID) {
    this._clientService.getClient(clientID).subscribe(( client: any ) => {
      console.log(client , 'este es el cliente ');
      this.client = client;
      this.loading = false;
    });
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
          width: 93,
          align: 'center',
          padding: 0,
        });
      } else {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 37,
          align: 'center',
          padding: 0
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
    doc.text( `Total vendido: $${this.totalSold.toFixed(2) }`, 10, 40);
    doc.text( `Total en devoluciones: $${this.totalReturned}`, 10, 45);
    doc.text( `Cliente: ${this.client.name} - ${this.route_name}`, 10, 55);
    doc.text( `Tienda: ${this.client.shop_name}`, 10, 60);
    doc.text( `Teléfono: ${this.client.phone}`, 10, 65);
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
          Producto: ` ${element.name} ${element.content}`,
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
        doc.text( 'Ventas Minoristas' , 10, 90);
        doc.table( 1 , 95, table1, headers,  {autoSize: false   } );
      } else {
        doc.addPage('a4', 'p' , );
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Ventas Minoristas' , 10, 30);
        doc.table( 1 , 35, table1, headers, {autoSize: false  });

      }
      tableStart = true;
    }

    if (this.dataSourceReturnedTable.data.length !== 0) {
      const table2: any = [];
      this.dataSourceReturnedTable.data.forEach((element: any) => {
        table2.push({
          Producto: ` ${element.name} ${element.content} `,
          Ruta: this.route_name,
          Marca: element.brand,
          Vendido: `${element.number_of_items}`,
          Precio: '$' + element.totalPrice,
          Total: '$' + parseFloat(`${ parseFloat(element.number_of_items) * parseFloat(element.totalPrice)}`).toFixed(2),
        });
      });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      if ( !tableStart ) {
        doc.text( 'Devoluciones' , 10, 90);
        doc.table(1, 95, table2, headers, {autoSize: false});
      } else {
        doc.addPage('a4', 'p');
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Devoluciones' , 10, 30);
        doc.table(1, 35, table2, headers, {autoSize: false});
      }
      tableStart = true;

    }

    if (this.dataSourceWholesaleTable.data.length !== 0) {
      const table3: any = [];
      this.dataSourceWholesaleTable.data.forEach((element: any) => {
        table3.push({
          Producto: ` ${element.name} ${element.content} `,
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
        doc.table(1, 95, table3, headers, {autoSize: false});
      } else {
        doc.addPage('a4', 'p');
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Ventas Mayorista' , 10, 30);
        doc.table(1, 35, table3, headers, {autoSize: false});
      }
      tableStart = true;
    }

    if (this.dataSourceWholesaleTableG.data.length !== 0) {
      const table4: any = [];
      this.dataSourceWholesaleTableG.data.forEach((element: any) => {
        table4.push({
          Producto: ` ${element.name} ${element.content} `,
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
        doc.table(1, 95, table4, headers, {autoSize: false});
      } else {
        doc.addPage('a4', 'p');
        doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
        doc.text( 'Ventas Gran Mayoreo' , 10, 30);
        doc.table(1, 35, table4, headers, {autoSize: false});
      }
      tableStart = true;
    }
    doc.save( `Ticket-${this.ticket}.pdf` );
  }

}
