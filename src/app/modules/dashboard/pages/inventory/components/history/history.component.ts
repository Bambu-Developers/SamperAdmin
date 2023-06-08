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
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { TicketComponent } from '../ticket/ticket.component';

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
  // public loading = true;
  public maxDate: Date;
  public dataId = '';
  // private _subscriptionSales: Subscription;
  // private _subscriptionRoutes: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _fb: FormBuilder,
    private _clientService: ClientsService,
    private _inventoryService: InventoryService,
    private dialog: MatDialog,
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
    const dateAuxEnd = new Date( dateEnd );
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
    // this.loading = true;
    const dateAux = new Date(this.formSearch.controls.dateStart.value).getTime();
    const dateAux2 = new Date(this.formSearch.controls.dateEnd.value).getTime();



    try {

      this._inventoryService.getSales(id, dataStart, dataEnd).subscribe(sales => {
        sales.forEach((element, index) => {
          sales[index].number_of_items = 0;
          const jsonArray: any = Object.keys(element.Products);
          jsonArray.forEach((product , indexP) => {
            sales[index].number_of_items = element.Products[product].number_of_items;
          });
        });
        this.dataSourceTableHistory.data = sales;
        console.log(sales);
      });
    } catch (error) {
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
  }


  public onEndDay(event: MatDatepickerInputEvent<Date>) {
    const date = event.value.getTime();
    const dateAux = new Date( date );
    this.endDate = moment(dateAux).format('YYYY-MM-DD');
  }

  public openModal(routeIdAux , ticketAux , customerAux) {
    this.dialog.open(TicketComponent, {
      width: '80vw',
      height: '80vh',
      disableClose: true,
      autoFocus: false,
      data : { route: routeIdAux , ticket: ticketAux,  client: customerAux}
    });
  }

  public dateDisamble() {
    const data1 = new Date(this.startDate).getTime();
    const data2 = new Date(this.endDate).getTime();
    return data1 > data2 ? true : false;
  }

}
function transformJSON(jsonData: any) {
  throw new Error('Function not implemented.');
}

