import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { InventoryService } from '../../services/inventory.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { concatMap, map, switchMap, filter, toArray, take } from 'rxjs/operators';
import { ClientsService } from '../../../clients/services/clients.service';
import { RouteModel } from '../../../clients/models/route.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy, AfterViewInit {

  public lanInv = INVENTORY_LANGUAGE;
  public lanHis = INVENTORY_LANGUAGE.history;
  public dataSourceTableHistory = new MatTableDataSource();
  public date: any = { begin: new Date(), end: new Date() };
  public displayedColumnsSales = ['ticket', 'date', 'route', 'total'];
  public form: FormGroup;
  public _allSales: any;
  public startDate: any = new Date();
  public endDate: any = new Date();
  public routes: RouteModel[];
  public productsSold: any;
  public totalSold: any;
  private _subscriptionSales: Subscription;
  private _subscriptionRoutes: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _datePipe: DatePipe,
    private _fb: FormBuilder,
    private _clientService: ClientsService,
    private _inventoryService: InventoryService,
  ) { }

  ngOnInit() {
    this.getRoutes();
    this.getAllSales();
    this.form = this._fb.group({
      date: [{ begin: new Date(), end: new Date() }],
      route: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  ngAfterViewInit() {
    this.dataSourceTableHistory.paginator = this.paginator;
  }

  public getAllSales() {
    this._subscriptionSales = this._inventoryService.getSales()
      .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        concatMap(sales => {
          const keys = Object.keys(sales);
          const salesArray = keys.map(k => sales[k]);
          return salesArray;
        }),
        toArray()
      )
      .subscribe(sales => {
        this.dataSourceTableHistory.data = sales;
      });
  }

  public getSalesByKeyAndDate(route) {

    this._inventoryService.getSalesByDate(route,  this.date.begin, this.date.end)
    .valueChanges()
      .pipe(
        take(1),
        concatMap(x => x),
        toArray()
      )
      .subscribe(sales => {
        this.dataSourceTableHistory.data = sales;
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
    this.dataSourceTableHistory.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    if (this._subscriptionSales) {
      this._subscriptionSales.unsubscribe();
    }
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
  }

}
