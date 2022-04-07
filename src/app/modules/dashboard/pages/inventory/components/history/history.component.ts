import { async } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { InventoryService } from '../../services/inventory.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { concatMap, toArray, take, map } from 'rxjs/operators';
import { ClientsService } from '../../../clients/services/clients.service';
import { RouteModel } from '../../../clients/models/route.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit {

  public lanInv = INVENTORY_LANGUAGE;
  public lanHis = INVENTORY_LANGUAGE.history;
  public dataSourceTableHistory = new MatTableDataSource();
  public date: any = { begin: new Date(), end: new Date() };
  public displayedColumnsSales = ['ticket', 'date', 'route', 'total'];
  public form: FormGroup;
  public formSearch: FormGroup;
  public _allSales: any;
  public startDate: any = new Date();
  public endDate: any = new Date();
  public routes: RouteModel[];
  public productsSold: any;
  public totalSold: any;
  public loading = true;
  public maxDate: Date;
  public dataId = '';
  // private _subscriptionSales: Subscription;
  // private _subscriptionRoutes: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _fb: FormBuilder,
    private _clientService: ClientsService,
    private _inventoryService: InventoryService,
  ) {
    this.formSearch = _fb.group({
      dateStart: [''],
      dateEnd: [''],
      routes: [''],
    });
   }

  ngOnInit() {
    // ONLY WHEN DELETE TICKETS
    // this.testDelete();


    this.form = this._fb.group({
      date: [{ begin: new Date(), end: new Date() }],
      route: new FormControl('', [Validators.required, ]),
    });
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
    this.dataSourceTableHistory.paginator = this.paginator;
  }

  // testDelete() {
  //   const fecha = moment('20200701', 'YYYYMMDD').toDate();
  //   this._inventoryService.getSalesToDelete('id de la ruta')
  //     .valueChanges().subscribe(res => {
  //       res.forEach(ticket => {
  //         if (moment(ticket['timesatamp']).toDate() < fecha) {
  //           this._inventoryService.deleteTicket('id de la ruta', ticket['id']);
  //         }
  //       });
  //     });
  // }

  testDataRoute() {
    const fecha = moment('20200701', 'YYYYMMDD').toDate();
    this._inventoryService.getSalesToDelete('1038623014')
      .valueChanges().subscribe(res => {

      });
  }

  public getRoutes() {
    this._clientService.getAllRoutes().subscribe(
      (res) => {
        this.formSearch.controls[('routes')].setValue( res[0].id );
        this.dataId = res[0].id;
        this.getAllSales( res[0].id , this.startDate , this.endDate );
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

  public async getAllSales(id: string , dataStart , dataEnd ) {
    console.log( dataStart , dataEnd );
    this.loading = true;

    try {

      await this._inventoryService.getSales(id ,  dataStart , dataEnd ).then( sales => {
        const keys = Object.keys(sales.data);
        const arrayAux = [];
        keys.forEach( ( element , index ) => {
          arrayAux.push(
            { date: sales.data[element].date , id: sales.data[element].id , route_id: sales.data[element].route_id ,
              route_name: sales.data[element].route_name, total: sales.data[element].total ,
              totalOnSalle: sales.data[element].totalOnSalle , customerId: sales.data[element].customerId}
          );
          if (index + 1 === arrayAux.length) {
            arrayAux.sort((r1, r2) => {
              if (r1.date > r2.date) {
                return -1;
              }
              if (r1.date < r2.date) {
                return 1;
              }
            });
          }
        });
        this.dataSourceTableHistory.data = arrayAux;
        this.loading = false;
      });

    } catch (error) {
      console.log( error , 'asdsadasdsadasdsa');
      this.loading = false;
      throw error;
    }


  }

  public getSalesByKeyAndDate(route) {
    this._inventoryService.getSalesByDate(route, this.date.begin, this.date.end)
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

  public doFilter = (value: string) => {
    this.dataSourceTableHistory.filter = value.trim().toLocaleLowerCase();
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
