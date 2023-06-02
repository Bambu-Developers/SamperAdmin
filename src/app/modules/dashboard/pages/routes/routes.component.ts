
import { ClientsService } from 'src/app/modules/shared/services/clients.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_LANGUAGE } from './data/language';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/modules/shared/services/users.service';
import { RouteService } from 'src/app/modules/shared/services/route.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit, OnDestroy {

  public lanRoute = ROUTE_LANGUAGE;
  public routes = new MatTableDataSource();
  public displayedColumns: string[] = ['id', 'name'];
  private _subscriptionRoutes: Subscription;
  private _subscriptionUsers: Subscription;

  constructor(
    private _clientsService: ClientsService,
    private _usersService: UsersService,
    private routeService: RouteService,
  ) { }

  ngOnInit() {
    this.getRoutes();
  }

  public getRoutes() {
    this._subscriptionRoutes = this.routeService.getAllRoutes().subscribe(
      res => {
        this.routes.data = res.sort((r1, r2) => {
          if (r1.name < r2.name) {
            return -1;
          }
          if (r1.name > r2.name) {
            return 1;
          }
          return 0;
        });
        this.routes.data.forEach((route: any) => {
          this._subscriptionUsers = this._usersService.getAllUsers().subscribe((user: any) => {
            user.forEach(u => {
              if (route.owner === u.id) {
                route['owner_name'] = u.name;
              }
              if (route.seller === u.id) {
                route['seller_name'] = u.name;
              }
            });
          });
        });
      }
    );
  }

  ngOnDestroy() {
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
    if (this._subscriptionUsers) {
      this._subscriptionUsers.unsubscribe();
    }
  }

}
