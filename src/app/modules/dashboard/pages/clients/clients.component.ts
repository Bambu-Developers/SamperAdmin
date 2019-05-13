import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { UsersService } from '../users/services/users.service';
import { Subscription } from 'rxjs';
import { RouteModel } from '../users/models/routes.model';
import { MatTableDataSource } from '@angular/material';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { PAGINATION } from 'src/app/modules/shared/components/paginator/data/data';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {

  public language = CLIENTS_LANGUAGE;
  public pagination = PAGINATION;
  public indexClients = 0;
  public clients = [];
  public routes: RouteModel[];
  public displayedColumns: string[] = ['bender_id', 'shop_name', 'name', 'route_id', 'haveCredit', 'last_conexion'];
  public subscriptionClient: Subscription;
  public subscriptionClients: Subscription;
  public subscriptionRoutes: Subscription;
  public dataSource = new MatTableDataSource();

  constructor(
    private clientsService: ClientsService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.getClients();
    this.getRoutes();
  }

  public getClients() {
    this.subscriptionClients = this.clientsService.getAllClients().subscribe(
      res => {
        this.clients = res;
        const data = [];
        this.clients.forEach(client => {
          this.subscriptionClient = this.clientsService.getRouteByID(client['route_id']).subscribe(route => {
            client['route_name'] = route.name;
          });
        });
        for (let i = 0; i < this.pagination.perPage; i++) {
          if (this.clients[i]) {
            data.push(this.clients[i]);
            this.indexClients = this.indexClients + i;
          }
        }
        this.dataSource.data = data;
        this.pagination.perPage = this.clients.length / 15 < 15 ? this.clients.length : this.clients.length / 15;
        this.pagination.totalItems = this.clients.length;
        this.pagination.totalPages = this.clients.length / 15 < 1 ? 1 : this.clients.length / 15;
      }
    );
  }

  public getRoutes() {
    this.subscriptionRoutes = this.usersService.getAllRoutes().subscribe(
      res => {
        this.routes = res;
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
