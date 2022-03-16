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
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  private _subscriptionRoutes: Subscription;
  private _subscriptionLiquidation: Subscription;
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
  ) {
    this.formSearch = _fb.group({
      dateStart: [''],
      dateEnd: ['']
    });
  }

  ngOnInit() {
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

  public getLiquidations( id: string , endItem: boolean ) {
    this._subscriptionLiquidation = this._inventoryService.getLiquidation(id , this.startDate , this.endDate).subscribe(liquidations => {
        liquidations.forEach(liquidation => {
          this._subscriptionRoutes = this._clientService.getRouteByID(liquidation.route).subscribe(route => {
            liquidation['route_name'] = route.name;
          });
        });
        this.dataLiquidation = this.dataLiquidation.concat(liquidations);
        console.log(liquidations);
        if (endItem) {
          this.dataSourceHistoryLiquidation.data = this.dataLiquidation.sort((r1: any, r2: any) => {
            if (r1.date > r2.date) {
              return -1;
            }
            if (r1.date < r2.date) {
              return 1;
            }
            return 0;
          });
          this.loading = false;
        }
      });
    return ( this.dataLiquidation.sort((r1: any, r2: any) => {
      if (r1.date > r2.date) {
        return -1;
      }
      if (r1.date < r2.date) {
        return 1;
      }
      return 0;
    }));
  }

  public  getRoutes() {
    this.dataLiquidation = [];
    this._subscriptionRoutes = this._clientService.getAllRoutes().subscribe(
      async (res) => {
        console.log(res);
        res.forEach( (element , index) => {
          if ( index === res.length - 1 ) {
            this.getLiquidations(element.id , true);
          } else {
            this.getLiquidations(element.id , false);
          }
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
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
    if (this._subscriptionLiquidation) {
      this._subscriptionLiquidation.unsubscribe();
    }
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
