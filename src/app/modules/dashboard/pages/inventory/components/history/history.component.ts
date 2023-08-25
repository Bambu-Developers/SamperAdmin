import { async } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { INVENTORY_LANGUAGE } from './../../data/language';
import { InventoryService } from '../../../../../shared/services/inventory.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { concatMap, toArray, take, map } from 'rxjs/operators';
import { ClientsService } from '../../../../../shared/services/clients.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { TicketComponent } from '../ticket/ticket.component';
import { RouteService } from 'src/app/modules/shared/services/route.service';
import { RouteModel } from '../../../users/models/routes.model';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _fb: FormBuilder,
    private _clientService: ClientsService,
    private _inventoryService: InventoryService,
    private dialog: MatDialog,
    private routeService: RouteService,
  ) {
    this.formSearch = _fb.group({
      dateStart: [''],
      dateEnd: [''],
      routes: [''],
    });
   }

  ngOnInit() {
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

  public getRoutes() {
    this.routeService.getAllRoutes().subscribe(
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
    console.log(dataStart , dataEnd)
    this.loading = true;
    try {
      await this._inventoryService.getSalesHistory(id ,  dataStart , dataEnd ).subscribe( sales => {
        sales.forEach( ( element , index ) => {
          if (index + 1 === sales.length) {
            sales.sort((r1, r2) => {
              if (r1.date > r2.date) {
                return -1;
              }
              if (r1.date < r2.date) {
                return 1;
              }
            });
          }
        });
        this.dataSourceTableHistory.data = sales;
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
      throw error;
    }
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

  public openModal(sale , routeIdAux , ticketAux , customerAux) {
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
