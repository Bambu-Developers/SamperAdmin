import { Component, OnInit, OnDestroy } from '@angular/core';
import { INVENTORY_LANGUAGE } from './data/language';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from '../../../shared/services/clients.service';
import { InventoryService } from '../../../shared/services/inventory.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { take, map, concatMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { LiquidationComponent } from './components/liquidation/liquidation.component';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from 'src/app/modules/shared/services/route.service';
import { RouteModel } from '../users/models/routes.model';
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
  public liquidationName: any;
  private _subscriptionInventories: Subscription;
  private _subscriptionRoutes: Subscription;
  private _allInventories: any;
  public form: FormGroup;
  public liquidationForm: FormGroup;
  public startDate;
  public endDate;

  chartData = [
    {
      data: [330, 600, 260, 700],
      label: 'Account A'
    },
    {
      data: [120, 455, 100, 340],
      label: 'Account B'
    },
    {
      data: [45, 67, 800, 500],
      label: 'Account C'
    }
  ];

  chartLabels = [
    'January',
    'February',
    'March',
    'April'
  ];

  chartOptions = {
    responsive: true
  };

  constructor(
    // private _inventoryService: InventoryService,
    private _clientService: ClientsService,
    private _router: Router,
    private _fb: FormBuilder,
    private _datePipe: DatePipe,
    private routeService: RouteService,
    private dialog: MatDialog,
  ) {}

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
    this._subscriptionRoutes = this.routeService.getAllRoutes().subscribe(
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

  public doLiquidation(  ) {
    // const date = { date: moment(this.liquidationForm.value['date']).format('YYYY-MM-DD') };
    // this._router.navigate(['/dashboard/inventory/liquidation/' + this.liquidation], { queryParams: date });

    this.dialog.open(LiquidationComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true,
      autoFocus: false,
      data : { route: this.liquidation , date: moment(this.liquidationForm.value['date']).format('YYYY-MM-DD') , existLiquidation: true , nameRute: this.liquidationName }
    });

  }

  public getDates() {
    this.form.get('date').valueChanges
      .subscribe(res => {
        this.startDate = this._datePipe.transform(res.begin, 'yyyy-MM-dd');
        this.endDate = this._datePipe.transform(res.end, 'yyyy-MM-dd');
      });
  }

  public setRoute(route , name) {
    this.liquidation = route;
    this.liquidationName = name;
  }

  public calculateCommission() {
    const data = {
      route: this.form.controls.route.value,
      startDate: moment(new Date(this.form.controls.date.value.begin)).format('YYYYMMDD'),
      endDate: moment(new Date(this.form.controls.date.value.end)).format('YYYYMMDD'),
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
