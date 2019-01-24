import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  rol: number;
  created: string;
  lastConexion: string;
  status: number;
  edit: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Ernesto David Salazar Molina', rol: 2, created: '27/Feb/2018', lastConexion: '27/Feb/2018', status: 0, edit: true },
];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'rol', 'created', 'lastConexion', 'status', 'edit'];
  public dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {}

}
