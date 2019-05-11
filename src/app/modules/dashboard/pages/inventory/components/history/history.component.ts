import { Component, OnInit } from '@angular/core';
import { INVENTORY_LANGUAGE } from './../../data/language';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public lanInv = INVENTORY_LANGUAGE;

  constructor() { }

  ngOnInit() {
  }

}
