import { Component, OnInit } from '@angular/core';
import { INVENTORY_LANGUAGE } from '../../data/language';

@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.scss']
})
export class LiquidationComponent implements OnInit {

  public lanLiq = INVENTORY_LANGUAGE.liquidation;

  constructor() { }

  ngOnInit() {
  }

}
