import { Component, OnInit, OnDestroy } from '@angular/core';
import { USERS_LANGUAGE } from './data/language';
import { UsersService } from './services/users.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public language = USERS_LANGUAGE;
  public displayedColumns: string[] = ['name', 'rol', 'dateCreated', 'lastConexion', 'status', 'edit'];
  public dataSource: any;

  public users;
  public subscriptrionUsers: Subscription;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.getsUsers();
  }

  public getsUsers() {
    this.subscriptrionUsers = this.usersService.getAllUsers().subscribe(
      res => {
        this.dataSource = res;
      }
    );
  }

  ngOnDestroy() {
    this.subscriptrionUsers.unsubscribe();
  }

}
