import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { USERS_LANGUAGE } from '../../data/language';

const ELEMENT_DATA: UserModel[] = [
  { name: 'Ernesto David Salazar Molina', rol: 2, dateCreated: '27/Feb/2018', lastConexion: '27/Feb/2018', status: 0, edit: true },
];

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {

  public language = USERS_LANGUAGE;
  public displayedColumns: string[] = ['name', 'rol', 'dateCreated', 'lastConexion', 'status', 'edit'];
  public dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
