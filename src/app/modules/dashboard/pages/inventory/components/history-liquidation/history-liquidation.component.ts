import { async } from '@angular/core/testing';
import { ExcelService } from './../../../../../shared/services/excel.service';
import { ClientsService } from '../../../../../shared/services/clients.service';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, Subscription, forkJoin, from } from 'rxjs';
import { RouteModel } from '../../../clients/models/route.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../../../../../shared/services/inventory.service';
import { concatMap, take, tap, toArray } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LiquidationComponent } from '../liquidation/liquidation.component';
import { RouteService } from 'src/app/modules/shared/services/route.service';

@Component({
  selector: 'app-history-liquidation',
  templateUrl: './history-liquidation.component.html',
  styleUrls: ['./history-liquidation.component.scss']
})
export class HistoryLiquidationComponent implements OnInit, OnDestroy, AfterViewInit {

  public routes: any[];
  public lanInv = INVENTORY_LANGUAGE;
  public lanLiq = INVENTORY_LANGUAGE.historyLiq;
  public dataSourceHistoryLiquidation = new MatTableDataSource();
  public dataLiquidation = [];
  public displayedColumnsHistoryLiquidation = ['dateSold', 'route', 'saleOfDay', 'totalLiq', 'totalLiqLoss'];
  public allLiquidations: any;
  public formSearch: FormGroup;
  public maxDate: Date;
  public endDate: any = new Date();
  public startDate: any = new Date();
  public loading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private routeService: RouteService,
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

  async ngOnInit() {
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

  public openModal(routeIdAux  , dateAux , rute ,id) {
    this.dialog.open(LiquidationComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true,
      autoFocus: false,
      data : { route: routeIdAux , date: dateAux , existLiquidation: false , nameRute: rute, id}
    });
  }

  public getLiquidations(id: string, name: any): Observable<any> {
    return this._inventoryService.getLiquidationToDate(id, this.startDate, this.endDate);
  }

  public async getRoutes() {
    this.dataSourceHistoryLiquidation.data = [];
    this.routeService.getAllRoutes().subscribe(async (res) => {
      this.routes = res;
      for await (const element of res) {
        this.getLiquidations(element.id, element.name).subscribe( (ress) => {
          this.dataSourceHistoryLiquidation.data = this.dataSourceHistoryLiquidation.data.concat(ress);
          this.dataSourceHistoryLiquidation.data = this.dataSourceHistoryLiquidation.data.sort((a: any, b: any) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          });
        } );
      };
      setTimeout( () => {
        this.loading = false;
      });
    });
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
    if (this.startDate !== undefined && this.endDate !== undefined) {
      if (this.startDate > this.endDate) {
      } else {
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

  public getRouteName( idRoute ): string {
    const name = this.routes.filter( (route: any) => route.id == idRoute );
    return name[0].name
  }

}
