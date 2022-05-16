import { ExcelService } from './../../../../../shared/services/excel.service';
import { ClientsService } from './../../../clients/services/clients.service';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouteModel } from '../../../clients/models/route.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../../services/inventory.service';
import { concatMap, take, toArray } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LiquidationComponent } from '../liquidation/liquidation.component';

@Component({
  selector: 'app-history-liquidation',
  templateUrl: './history-liquidation.component.html',
  styleUrls: ['./history-liquidation.component.scss']
})
export class HistoryLiquidationComponent implements OnInit, OnDestroy, AfterViewInit {

  public routes: RouteModel[];
  public lanInv = INVENTORY_LANGUAGE;
  public lanLiq = INVENTORY_LANGUAGE.historyLiq;
  public dataSourceHistoryLiquidation = new MatTableDataSource();
  public dataLiquidation = [];
  public displayedColumnsHistoryLiquidation = ['dateSold', 'route', 'saleOfDay', 'totalLiq', 'totalLiqLoss'];
  // private _subscriptionRoutes: Subscription;
  // private _subscriptionLiquidation: Subscription;
  public allLiquidations: any;
  public formSearch: FormGroup;
  public maxDate: Date;
  public endDate: any = new Date();
  public startDate: any = new Date();
  public loading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _clientService: ClientsService,
    private _inventoryService: InventoryService,
    private _router: Router,
    private excelService: ExcelService,
    private _fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.formSearch = _fb.group({
      dateStart: [''],
      dateEnd: ['']
    });
  }

  ngOnInit() {
    this.loading = true;
    this.maxDate = new Date();
    const dateEnd = this.maxDate.getTime();
    const dateAuxEnd = new Date( dateEnd + 86400000);
    const dateStart = this.maxDate.getTime();
    const dateAuxStart = new Date( dateStart - (86400000 * 7 ));
    this.endDate = moment(dateAuxEnd).format('YYYY-MM-DD');
    this.formSearch.controls[('dateEnd')].setValue( new Date(dateEnd) );
    this.formSearch.controls[('dateStart')].setValue(new Date(dateAuxStart));
    const dataAuxStart =  moment(this.formSearch.controls[('dateStart')].value).format('YYYY-MM-DD');
    this.startDate = dataAuxStart;
    this.getRoutes();
  }

  ngAfterViewInit() {
    this.dataSourceHistoryLiquidation.paginator = this.paginator;
  }

  public openModal(routeIdAux  , dateAux) {
    this.dialog.open(LiquidationComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true,
      autoFocus: false,
      data : { route: routeIdAux , date: dateAux , existLiquidation: false}
    });
  }

  public async getLiquidations( id: string , name: any ): Promise<any> {
    await this._inventoryService.getLiquidation(id , this.startDate , this.endDate).then(liquidations => {
        const keys = Object.keys(liquidations.data);
        keys.forEach( ( element , index ) => {
          const dataAux = liquidations.data[element];
          dataAux.route_name = name;
          this.dataLiquidation.push(liquidations.data[element]);
        } );
    });
  }

  public getRoutes() {
    let i = 0;
    this.dataLiquidation = [];
    this._clientService.getAllRoutes().subscribe(
       (res: any) => {
        if ( i < res.length ) {
          res.forEach( (element , index) => {
            i = i + 1;
            this.getLiquidations(element.id  , element.name).then( () => {
              if ( i === res.length  ) {
                this.dataSourceHistoryLiquidation.data.sort((r1: any, r2: any) => {
                  if (r1.date > r2.date) {
                    return -1;
                  }
                  if (r1.date < r2.date) {
                    return 1;
                  }
                  return 0;
                });
                this.routes = res.sort((r1, r2) => {
                  if (r1.name < r2.name) {
                    return -1;
                  }
                  if (r1.name > r2.name) {
                    return 1;
                  }
                  return 0;
                });
                this.dataSourceHistoryLiquidation.data = this.dataLiquidation;
                setTimeout( () => {
                  this.loading = false;
                }, 600);
              }
            });
          });
        } else {
          res.unsubscribe();
        }
        return;
      }
    );

  }

  public doFilter = (value: string) => {
    this.dataSourceHistoryLiquidation.filter = value.trim().toLocaleLowerCase();
  }

  public downloadLiquidation() {
    const tableToDownload = [];
    for (const liquidation of this.dataSourceHistoryLiquidation.data) {
      tableToDownload.push({
        'Fecha': liquidation['date'],
        'Ruta': liquidation['route_name'],
        'Ventas del día': liquidation['date'],
        'Total liquidado': liquidation['total_liquidation'],
        'Total liquidado con merma ': liquidation['total_liq_loss']
      });
    }
    this.excelService.exportAsExcelFile(tableToDownload, `${'Historial_liquidaciones_'}`);
  }

  ngOnDestroy() {

  }

  public onStartDay(event: MatDatepickerInputEvent<Date>) {
    const date = event.value.getTime();
    const dateAux = new Date( date);
    this.startDate = moment(dateAux).format('YYYY-MM-DD');

    // this.enableButton = false;
    if (this.startDate !== undefined && this.endDate !== undefined) {
      if (this.startDate > this.endDate) {
        // this.dataError = true;
      } else {
        // this.dataError = false;
      }
    }
  }


  public onEndDay(event: MatDatepickerInputEvent<Date>) {
    const date = event.value.getTime();
    const dateAux = new Date( date + 86400000);
    this.endDate = moment(dateAux).format('YYYY-MM-DD');

    // this.enableButton = false;
    if (this.startDate !== undefined && this.endDate !== undefined) {
      if (this.startDate > this.endDate) {
        // this.dataError = true;
      } else {
        // this.dataError = false;
      }
    }
  }

}
