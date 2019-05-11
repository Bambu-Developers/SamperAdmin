import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { UsersService } from '../users/services/users.service';
import { Subscription } from 'rxjs';
import { RouteModel } from '../users/models/routes.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { CONST_PAGINATOR } from 'src/app/modules/dashboard/data/paginator.data';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {

  public language = CLIENTS_LANGUAGE;
  public pagintor = CONST_PAGINATOR;
  public routes: RouteModel[];
  public displayedColumns: string[] = ['bender_id', 'shop_name', 'name', 'route_id', 'haveCredit', 'last_conexion'];
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

  public getClients() {
    this.subscriptionClients = this.clientsService.getAllClients().subscribe(
      res => {
        this.dataSource.data = res;
        this.dataSource.data.forEach(client => {
          this.subscriptionClient = this.clientsService.getRouteByID(client['route_id']).subscribe(route => {
            client['route_name'] = route.name;
          });
        });
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
