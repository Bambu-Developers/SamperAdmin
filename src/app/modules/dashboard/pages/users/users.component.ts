import { Component, OnInit, OnDestroy } from '@angular/core';
import { USERS_LANGUAGE } from './data/language';
import { UsersService } from './services/users.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { AuthService } from './../../../account/services/auth.service';
import { RouteModel } from './models/routes.model';
import { PAGINATION } from './../../../shared/components/paginator/data/data';


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
  public pagination = PAGINATION;
  public indexUsers = 0;
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
        this.users = res;
        const data = [];
        this.users.forEach(user => {
          if (user['rol'] === 0) {
            this._subscriptrionUser = this.usersService.getRouteByID(user['route']).subscribe(route => {
              user['route_name'] = route.name;
            });
          }
        });
        for (let i = 0; i < this.pagination.perPage; i++) {
          if (res[i]) {
            data.push(res[i]);
            this.indexUsers = this.indexUsers + i;
          }
        }
        // this.dataSource.data = data;
        this.pagination.perPage = res.length / 15 < 15 ? res.length : res.length / 15;
        this.pagination.totalItems = res.length;
        this.pagination.totalPages = res.length / 15 < 1 ? 1 : res.length / 15;
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

  public nextPage() {
    this.pagination.page++;
    this.dataSource.data = [];
    for (let i = this.indexUsers; i < this.pagination.perPage * this.pagination.page; i++) {
      this.dataSource.data.push(this.users[i]);
      this.indexUsers++;
    }
  }

  public beforePage() {
    this.pagination.page--;
    this.dataSource.data = [];
    for (let i = this.indexUsers; i > this.pagination.perPage * this.pagination.page; i--) {
      this.dataSource.data.push(this.users[i]);
      this.indexUsers--;
    }
  }

  ngOnDestroy() {
    if (this._subscriptrionUser) {
      this._subscriptrionUser.unsubscribe();
    }
    if (this._subscriptrionUsers) {
      this._subscriptrionUsers.unsubscribe();
    }
    if (this._subscriptionUserLogged) {
      this._subscriptionUserLogged.unsubscribe();
    }
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
  }

}
