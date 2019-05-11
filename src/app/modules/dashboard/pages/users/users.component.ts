import { Component, OnInit, OnDestroy } from '@angular/core';
import { USERS_LANGUAGE } from './data/language';
import { UsersService } from './services/users.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from './../../../account/services/auth.service';
import { RouteModel } from './models/routes.model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public language = USERS_LANGUAGE;
  public displayedColumns: string[] = ['name', 'rol', 'route', 'dateCreated', 'lastConexion', 'status', 'edit'];
  public dataSource = new MatTableDataSource();
  public email: string;
  public routes: RouteModel[];
  public users;
  public user;
  public dataUserLogged: any;
  public logged: any;
  public _subscriptrionUsers: Subscription;
  private _subscriptionUserLogged: Subscription;
  private _subscriptrionUser: Subscription;
  private _subscriptionRoutes: Subscription;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.getsUsers();
    this.getRoutes();
    this.email = this.authService.getUser();
    this.logged = this.getsUsersLogged();
  }

  public getsUsers() {
    this._subscriptrionUsers = this.usersService.getAllUsers().subscribe(
      res => {
        this.dataSource.data = res;
        this.dataSource.data.forEach( user => {
          if (user['rol'] === 0) {
            this._subscriptrionUser = this.usersService.getRouteByID(user['route']).subscribe(route => {
              user['route_name'] = route.name;
            });
          }
        });
      }
    );
  }

  public getRoutes() {
    this._subscriptionRoutes = this.usersService.getAllRoutes().subscribe(
      res => {
        this.routes = res;
      }
    );
  }

  public getsUsersLogged() {
    this._subscriptionUserLogged = this.usersService.getUserLogged(this.email).subscribe(
      res => {
        this.dataUserLogged = res;
        this.logged = this.dataUserLogged[0];
      });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngOnDestroy() {
    this._subscriptrionUser.unsubscribe();
    this._subscriptrionUsers.unsubscribe();
    this._subscriptionUserLogged.unsubscribe();
    this._subscriptionRoutes.unsubscribe();
  }

}
