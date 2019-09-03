import { Component, OnInit, OnDestroy } from '@angular/core';
import { INVENTORY_LANGUAGE } from './data/language';
import { MatTableDataSource } from '@angular/material';
import { ClientsService } from './../clients/services/clients.service';
import { InventoryService } from './services/inventory.service';
import { Subscription } from 'rxjs';
import { RouteModel } from '../clients/models/route.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { take, map, concatMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit, OnDestroy {

  public lanInv = INVENTORY_LANGUAGE;
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['sku', 'image', 'name', 'quantity', 'brand', 'category'];
  public routes: RouteModel[];
  public routeSelected = false;
  public commissionCalc = false;
  public user: any;
  public liquidation: any;
  private _subscriptionInventories: Subscription;
  private _subscriptionRoutes: Subscription;
  private _allInventories: any;
  public form: FormGroup;
  public liquidationForm: FormGroup;
  public startDate;
  public endDate;

  constructor(
    private _inventoryService: InventoryService,
    private _clientService: ClientsService,
    private _router: Router,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getRoutes();
    this.form = this._fb.group({
      date: [{ begin: new Date(), end: new Date() }],
      route: new FormControl('', [
        Validators.required,
      ]),
    });
    this.liquidationForm = new FormGroup({
      date: new FormControl('', [
        Validators.required
      ])
    });
    this.getDates();
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

  public doFilter(value: string = 'noSeller') {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public doLiquidation() {
    const date = { date: moment(this.liquidationForm.value['date']).format('YYYY-MM-DD') };
    this._router.navigate(['/dashboard/inventory/liquidation/' + this.liquidation], { queryParams: date });
  }

  public getDates() {
    this.form.get('date').valueChanges
      .subscribe(res => {
        this.startDate = this._datePipe.transform(res.begin, 'yyyy-MM-dd');
        this.endDate = this._datePipe.transform(res.end, 'yyyy-MM-dd');
      });
  }

  public setRoute(route) {
    this.liquidation = route;
  }

  public calculateCommission() {
    const data = {
      route: this.form.controls.route.value,
      startDate: moment(new Date(this.form.controls.date.value.begin)).format("YYYYMMDD"),
      endDate: moment(new Date(this.form.controls.date.value.end)).format("YYYYMMDD"),
    };
    this._router.navigate(['/dashboard/inventory/commission/'], { queryParams: data });
  }

  ngOnDestroy() {
    if (this._subscriptionInventories) {
      this._subscriptionInventories.unsubscribe();
    }
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
  }

}
