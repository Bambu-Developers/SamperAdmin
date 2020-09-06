import { CHART_TYPES, SALES_ROUTE_LABELS, SALES_ROUTE_TITLE,
         CLIENTS_ROUTE_COLORS } from './../../data/data';
import { ANALYTICS_LANGUAGE } from './../../data/language';
import { Component, OnInit } from '@angular/core';
import { createChart } from '../../object-chart';

@Component({
  selector: 'app-clients-analytics',
  templateUrl: './clients-analytics.component.html',
  styleUrls: ['./clients-analytics.component.scss']
})
export class ClientsAnalyticsComponent implements OnInit {

  public language = ANALYTICS_LANGUAGE;
  public CLIENTS_ROUTE_COLORS = CLIENTS_ROUTE_COLORS;
  public clientsRouteData = createChart(CHART_TYPES.BAR, SALES_ROUTE_LABELS, [], SALES_ROUTE_TITLE, '');

  constructor() { }

  ngOnInit() {
    this.clientsRouteData.data = [400, 500, 300, 600, 400, 500, 700];
  }

}
