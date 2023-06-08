
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { InventoryService } from './../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { Component, OnInit, OnDestroy , Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

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
  public displayedColumnsDevolutions = [
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
    console.log(this.data.client);
    this.getTicketData(this.clientID, this.ticket);
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
    this._inventoryService.getSaleByTicket(route, ticket).subscribe(
      ress => {
        console.log(ress);
        this.credit = ress.pay_whit_credit ? ress.pay_whit_credit_amount : 0;
        this.clientID = ress.customerId;
        this.date = ress.date;
        this.route_name = ress.route_name;
        this.totalSold = ress.totalOnSalle;
        const productKeys = Object.keys(ress.Products);
        const dataSales = [];
        const retailProducts = [];
        const wholesaleProducts = [];
        const wholesaleProductsG = [];

        if (ress.Devolutions) {
          const evolutionKeys = Object.keys(ress.Devolutions);
          this.getDevolutions( ress , evolutionKeys );
        }

        productKeys.forEach(( element , index ) => {
          dataSales.push(ress.Products[element]);

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
          width: 103,
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
          width: 35,
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
          width: 30,
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
          width: 30,
          height: 10,
          align: 'left',
          padding: 0,
        });
      }

    }
    return result;
  }

  public async getPdf() {
    const headers = this.createHeaders([
      'Producto',
      'Ruta',
      'Marca',
      'Entregados',
      'Precio',
      'Total',
    ]);
    let pagePdf = 0;
    let linePdf = 0;
    const doc = new jsPDF();
    doc.addImage( '../../../../../../../assets/images/Logox2.webp' , 'PNG', 10, 10, 50, 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text( `Ticket: ${this.ticket}` , 10, 30);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text( `Total Entregados: $${this.totalSold.toFixed(2) }`, 10, 35);
    doc.text( `Total en devoluciones: $${this.totalReturned}`, 10, 40);
    doc.text( `Cliente: ${ this.client !== undefined ? this.client.name : this.clientID } - ${this.route_name}`, 10, 50);
    doc.text( `Tienda: ${ this.client !== undefined ? this.client.shop_name : this.clientID }`, 10, 55);
    doc.text( `Teléfono: ${ this.client !== undefined ? this.client.phone : 'Sin teléfono' }`, 10, 60);

    if (this.dataSourceRetailTable.data.length !== 0) {
      const table1: any = [[]];
      await this.dataSourceRetailTable.data.forEach((element: any, index: any) => {
        if (pagePdf === 0 && linePdf <= 31) {
          table1[0].push({
            Producto: ` ${element.name} `,
            Ruta: this.route_name,
            Marca: element.brand,
            Entregados: `${element.number_of_items}`,
            Precio: '$' + element.retail_price,
            Total: '$' + parseFloat(`${ parseFloat(element.number_of_items) * parseFloat(element.retail_price)}`).toFixed(2),
          });
        }
        if (pagePdf > 0 && linePdf <= 39) {
          table1[table1.length - 1].push({
            Producto: ` ${element.name} `,
            Ruta: this.route_name,
            Marca: element.brand,
            Entregados: `${element.number_of_items}`,
            Precio: '$' + element.retail_price,
            Total: '$' + parseFloat(`${ parseFloat(element.number_of_items) * parseFloat(element.retail_price)}`).toFixed(2),
          });
        }
        linePdf++;
        if (pagePdf === 0 && linePdf === 35 && index < this.dataSourceRetailTable.data.length - 1) {
          linePdf = 0;
          pagePdf++;
          table1.push([]);
        }
        if (pagePdf > 0 && linePdf === 40 && index < this.dataSourceRetailTable.data.length - 1) {
          linePdf = 0;
          pagePdf++;
          table1.push([]);
        }
        if (index === this.dataSourceRetailTable.data.length - 1) {
          table1.forEach((elementTable, indexTable) => {
            if (indexTable === 0) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(16);
              doc.text('Entregadas', 10, 70);
              doc.table(6, 75, table1[indexTable], headers, { fontSize: 8, padding: 1.2, printHeaders: true });
            } else {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(16);
              doc.addPage('a4', 'p');
              doc.addImage('../../../../../../../assets/images/logo_sanper.png', 'PNG', 10, 10, 50, 10);
              doc.text('Entregadas', 10, 30);
              doc.table(6, 35, table1[indexTable], headers, { fontSize: 8, padding: 1.2, printHeaders: true });
            }
          });
        }
      });
    }

    if (this.dataSourceReturnedTable.data.length !== 0) {
      const table2: any = [[]];
      const initialHeight = linePdf;
      let space = 39;
      let indexTab = 0;
      linePdf = linePdf  + 3;
      if ( pagePdf === 0 ) {
        space = 35 - linePdf;
      }
      if ( pagePdf > 0 ) {
        space = 38 - linePdf;
      }
      if (  35 - linePdf < 15  && pagePdf === 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      if (  39 - linePdf < 15  && pagePdf > 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      await this.dataSourceReturnedTable.data.forEach(( element2: any , index: any) => {
          table2[ table2.length - 1 ].push({
            Producto: ` ${element2.name}  `,
            Ruta: this.route_name,
            Marca: element2.brand,
            Entregados: `${element2.number_of_items}`,
            Precio: '$' + element2.retail_price,
            Total: '$' + parseFloat(`${ parseFloat(element2.number_of_items) * parseFloat(element2.retail_price)}`).toFixed(2),
          });
        indexTab++;
        linePdf ++;
        if (indexTab === space || this.dataSourceReturnedTable.data.length - 1 === index ) {
          if ( space < 39 ) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.text( 'Devoluciones' , 10, ( pagePdf === 0  ? 75 + ((initialHeight + 4) * 6.2 ) : 45 + (initialHeight * 6.2 )));
            doc.table( 6 , ( pagePdf === 0  ? 80 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )),
            table2[table2.length - 1], headers, { fontSize: 8 , padding: 1.2 , printHeaders: true  }   );
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.addPage('a4', 'p' , );
            doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
            doc.text( 'Devoluciones' , 10, 30);
            doc.table( 6 , 35, table2[table2.length - 1], headers, { fontSize: 8 , padding: 1.2 , printHeaders: true });
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
        space = 35 - linePdf;
      }
      if ( pagePdf > 0 ) {
        space = 38 - linePdf;
      }
      if (  35 - linePdf < 15  && pagePdf === 0 ) {
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
            Producto: ` ${element2.name}  `,
            Ruta: this.route_name,
            Marca: element2.brand,
            Entregados: `${element2.number_of_items}`,
            Precio: '$' + element2.wholesale_price,
            Total: '$' + parseFloat(`${ parseFloat(element2.number_of_items) * parseFloat(element2.wholesale_price)}`).toFixed(2),
          });
        indexTab++;
        linePdf ++;
        if (indexTab === space || this.dataSourceWholesaleTable.data.length - 1 === index ) {
          if ( space < 39 ) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.text( 'Entregas Mayorista' , 10, ( pagePdf === 0  ? 75 + ((initialHeight + 4) * 6.2 ) : 45 + (initialHeight * 6.2 )));
            doc.table( 6 , ( pagePdf === 0  ? 80 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )),
            table3[table3.length - 1], headers, { fontSize: 8 , padding: 1.2 , printHeaders: true  }   );
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.addPage('a4', 'p' , );
            doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
            doc.text( 'Entregas Mayorista' , 10, 30);
            doc.table( 6 , 35, table3[table3.length - 1], headers, { fontSize: 8 , padding: 1.2 , printHeaders: true });
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

    if (this.dataSourceWholesaleTableG.data.length !== 0) {
      const table3: any = [[]];
      const initialHeight = linePdf;
      let space = 39;
      let indexTab = 0;
      linePdf = linePdf  + 3;
      if ( pagePdf === 0 ) {
        space = 35 - linePdf;
      }
      if ( pagePdf > 0 ) {
        space = 38 - linePdf;
      }
      if (  35 - linePdf < 15  && pagePdf === 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      if (  39 - linePdf < 15  && pagePdf > 0 ) {
        linePdf = 0;
        pagePdf ++;
        space = 39;
      }
      await this.dataSourceWholesaleTableG.data.forEach(( element2: any , index: any) => {
          table3[ table3.length - 1 ].push({
            Producto: ` ${element2.name}  `,
            Ruta: this.route_name,
            Marca: element2.brand,
            Entregados: `${ parseFloat(element2.number_of_items)}`,
            Precio: '$' + element2.wholesale_priceG,
            Total: '$' + parseFloat(`${ parseFloat(element2.number_of_items) * parseFloat(element2.wholesale_priceG)}`).toFixed(2),
          });
        indexTab++;
        linePdf ++;
        if (indexTab === space || this.dataSourceWholesaleTableG.data.length - 1 === index ) {
          if ( space < 39 ) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.text( 'Entregas Gran Mayoreo' , 10, ( pagePdf === 0  ? 75 + ((initialHeight + 4) * 6.2 ) : 45 + (initialHeight * 6.2 )));
            doc.table( 6 , ( pagePdf === 0  ? 80 + ((initialHeight + 4) * 6.2 ) : 50 + (initialHeight * 6.2 )),
            table3[table3.length - 1], headers, { fontSize: 8 , padding: 1.2 , printHeaders: true  }   );
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(16);
            doc.addPage('a4', 'p' , );
            doc.addImage( '../../../../../../../assets/images/logo_sanper.png' , 'PNG', 10, 10, 50, 10);
            doc.text( 'Entregas Gran Mayoreo' , 10, 30);
            doc.table( 6 , 35, table3[table3.length - 1], headers, { fontSize: 8 , padding: 1.2 , printHeaders: true });
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

    doc.save( `Ticket-${this.ticket}.pdf` );
  }

}
