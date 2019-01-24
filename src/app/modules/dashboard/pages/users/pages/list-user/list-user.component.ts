import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { USERS_LANGUAGE } from '../../data/language';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

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

  public getsUsers() {  }

}
