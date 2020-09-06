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
  public displayedColumnsHistoryLiquidation = ['dateSold', 'route', 'saleOfDay', 'totalLiq', 'totalLiqLoss'];
  private _subscriptionRoutes: Subscription;
  private _subscriptionLiquidation: Subscription;
  public allLiquidations: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _clientService: ClientsService,
    private _inventoryService: InventoryService,
    private _router: Router,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.getLiquidations();
    this.getRoutes();
  }

  ngAfterViewInit() {
    this.dataSourceHistoryLiquidation.paginator = this.paginator;
  }

  public getLiquidations() {
    this._subscriptionLiquidation = this._inventoryService.getLiquidation()
      .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        concatMap(liquidations => {
          const keys = Object.keys(liquidations);
          const liquidationsArray = keys.map(k => liquidations[k]);
          return liquidationsArray;
        }),
        toArray()
      ).subscribe(liquidations => {
        liquidations.forEach(liquidation => {
          this._subscriptionRoutes = this._clientService.getRouteByID(liquidation.route).subscribe(route => {
            liquidation['route_name'] = route.name;
          });
        });
        this.dataSourceHistoryLiquidation.data = liquidations.sort((r1, r2) => {
          if (r1.date > r2.date) {
            return -1;
          }
          if (r1.date < r2.date) {
            return 1;
          }
          return 0;
        });
      });
  }

  public getRoutes() {
    this._subscriptionRoutes = this._clientService.getAllRoutes().subscribe(
      res => {
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
}
