import { Component, OnInit } from '@angular/core';
import { USERS_LANGUAGE } from './data/language';
import { UsersService } from './services/users.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public language = USERS_LANGUAGE;
  public displayedColumns: string[] = ['name', 'rol', 'dateCreated', 'lastConexion', 'status', 'edit'];
  public dataSource: any;

  public users;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.getsUsers();
  }

  public getsUsers() {
    this.usersService.getAllUsers().subscribe(
      res => {
        this.dataSource = res;
      }
    );
  }

}
