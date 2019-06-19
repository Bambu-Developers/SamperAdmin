import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { UsersService } from '../users/services/users.service';
import { Subscription } from 'rxjs';
import { RouteModel } from '../users/models/routes.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { PAGINATION } from 'src/app/modules/shared/components/paginator/data/data';

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
  public routes: RouteModel[];
  public displayedColumns: string[] = ['bender_id', 'shop_name', 'name', 'route_id'];
  public subscriptionClient: Subscription;
  public subscriptionClients: Subscription;
  public subscriptionRoutes: Subscription;
  public dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private clientsService: ClientsService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.getClients();
    this.getRoutes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public getClients() {
    this.subscriptionClients = this.clientsService.getAllClients().subscribe(
      res => {
        this.dataSource.data = res;
        this.clients = res;
        const data = [];
        this.clients.forEach(client => {
          if (client.route_id !== '') {
            this.subscriptionClient = this.clientsService.getRouteByID(client['route_id']).subscribe(route => {
              if (route !== null) {
                client['route_name'] = route.name;
              }
            });
          }
        });
        for (let i = 0; i < this.pagination.perPage; i++) {
          if (this.clients[i]) {
            data.push(this.clients[i]);
            this.indexClients = this.indexClients + i;
          }
        }
      }
    );
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
    this.dataSource.filter = value.trim().toLocaleLowerCase();
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
}
