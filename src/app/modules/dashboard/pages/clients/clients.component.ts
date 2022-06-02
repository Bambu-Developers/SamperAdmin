import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { UsersService } from '../users/services/users.service';
import { Subscription, of } from 'rxjs';
import { RouteModel } from '../users/models/routes.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { PAGINATION } from 'src/app/modules/shared/components/paginator/data/data';
import { mergeMap, concatMap, map, take, toArray } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeRoutComponent } from './change-rout/change-rout.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy, AfterViewInit {

  public language = CLIENTS_LANGUAGE;
  public pagination = PAGINATION;
  public indexClients = 0;
  public clients = [];
  public loading = true;
  public routes: RouteModel[];
  public displayedColumns: string[] = ['bender_id', 'shop_name', 'name', 'route_id'];
  public subscriptionClient: Subscription;
  public subscriptionClients: Subscription;
  public subscriptionRoutes: Subscription;
  public dataSource = new MatTableDataSource();
  public lookCheck = false;
  public checkRout = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private clientsService: ClientsService,
    private usersService: UsersService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getClients();
    this.getRoutes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public getClients() {
    this.subscriptionClients = this.clientsService.getAllClients().pipe(
      take(1),
      concatMap(x => x),
      mergeMap(client => {
        return this.clientsService.getRouteByID(client['route_id'])
          .pipe(
            take(1),
            map(route => Object.assign({}, { ...client, route_name: route.name }))
          );
      }),
      toArray()
    ).subscribe(
      res => {
        this.dataSource.data = res;
        this.clients = res;
        this.loading = false;
        const dataClient = {};
        res.forEach( ( element , index ) => {
          dataClient[element.id] = element;
          if ( index + 1 === res.length ) {
            localStorage.setItem( 'clients' , JSON.stringify(dataClient) );
          }
        });
      }
    );
    this.setDataPaginator();
  }

  public setDataPaginator() {
    for (let i = 0; i < this.pagination.perPage; i++) {
      if (this.clients[i]) {
        this.indexClients = this.indexClients + i;
      }
    }
  }

  public setRouteNames() {
    this.clients.forEach(client => {
      if (client.route_id !== '') {
        this.subscriptionClient = this.clientsService.getRouteByID(client['route_id']).subscribe(route => {
          if (route !== null) {
            client['route_name'] = route.name;
          }
        });
      }
    });
  }

  public getRoutes() {
    this.subscriptionRoutes = this.usersService.getAllRoutes().subscribe(
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
    this.dataSource.filter = value.trim().toLowerCase();
    if (value.toLowerCase() === '') {
      this.lookCheck = false;
    } else {
      this.lookCheck = true;
    }
  }

  public nextPage() {
    this.pagination.page++;
    this.dataSource.data = [];
    for (let i = this.indexClients; i < this.pagination.perPage * this.pagination.page; i++) {
      this.dataSource.data.push(this.clients[i]);
      this.indexClients++;
    }
  }

  public beforePage() {
    this.pagination.page--;
    this.dataSource.data = [];
    for (let i = this.indexClients; i > this.pagination.perPage * this.pagination.page; i--) {
      this.dataSource.data.push(this.clients[i]);
      this.indexClients--;
    }
  }

  ngOnDestroy() {
    if (this.subscriptionClients) {
      this.subscriptionClients.unsubscribe();
    }
    if (this.subscriptionRoutes) {
      this.subscriptionRoutes.unsubscribe();
    }
    if (this.subscriptionClient) {
      this.subscriptionClient.unsubscribe();
    }
  }

  public goDetail(id) {
    this.router.navigate([ `/dashboard/clients/view/${id}`]);
  }

  public changeRout() {
    this.dialog.open(ChangeRoutComponent, {
      width: '500px',
      minHeight: '200px',
      disableClose: true,
      autoFocus: false,
      data: {routes: this.routes , client: this.dataSource.filteredData }
    });
  }

}
