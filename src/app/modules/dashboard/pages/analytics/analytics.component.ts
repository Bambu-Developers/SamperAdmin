import {
  FILTER, CHART_TYPES,
  SALES_TITLE, SALES_LABELS, SALES_LABELS_YEAR, SALES_COLORS,
  SALES_ROUTE_TITLE, SALES_ROUTE_LABELS, SALES_ROUTE_COLORS,
  PRODUCTS_TITLE, PRODUCTS_LABELS, PRODUCTS_COLORS
} from './data/data';
import { ANALYTICS_LANGUAGE } from './data/language';
import { Component, OnInit } from '@angular/core';
import { createChart } from './object-chart';
import * as moment from 'moment';
import { ClientsService } from '../../../shared/services/clients.service';
moment.locale('es');

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  public language = ANALYTICS_LANGUAGE;
  public FILTER = FILTER;
  public filterByPeriod = 0;
  public dateSales = moment();
  public startWeek = moment().startOf('week');
  public endWeek = moment().endOf('week');
  public SALES_COLORS = SALES_COLORS;
  public SALES_ROUTE_COLORS = SALES_ROUTE_COLORS;
  public PRODUCTS_COLORS = PRODUCTS_COLORS;
  public salesData = createChart(CHART_TYPES.BAR, SALES_LABELS, [], SALES_TITLE, '');
  public salesRouteData = createChart(CHART_TYPES.BAR, SALES_ROUTE_LABELS, [], SALES_ROUTE_TITLE, '');
  public productsData = createChart(CHART_TYPES.BAR, PRODUCTS_LABELS, [], PRODUCTS_TITLE, '');
  public clientMonth = createChart(CHART_TYPES.BAR, SALES_LABELS, [], SALES_TITLE, '');
  public clientYear = '';
  public years = [];
  constructor(
    private _clientService: ClientsService,
  ) { }

  ngOnInit() {


    this.salesData.barChartData = [
      { data: [1, 2, 3, 5, 4, 7, 6], label: SALES_LABELS, type: 'line', fill: 'false' },
      { data: [1, 2, 3, 5, 4, 7, 6], label: SALES_LABELS, type: 'bar' },
    ];
    this.salesRouteData.data = [400, 500, 300, 600, 300, 500, 700];
    this.productsData.data = [180, 40, 219, 400, 58, 91, 208, 119, 79, 39,
      69, 96, 49, 159, 305, 218, 60, 409, 290, 256];
  }

  public changeFilterPeriod(period) {
    this.filterByPeriod = period;
    this.changeData(period);
  }

  public changeData(period) {
    switch (period) {
      case FILTER.WEEK:
        this.salesData.labels = SALES_LABELS;
        break;
      case FILTER.MONTH:
        break;
      case FILTER.YEAR:
        this.salesData.labels = SALES_LABELS_YEAR;
        this.salesData.barChartData = [
          { data: [1, 2, 3, 5, 4, 7, 6, 9, 12, 8, 10, 11], label: SALES_LABELS, type: 'line', fill: 'false' },
          { data: [1, 2, 3, 5, 4, 7, 6, 9, 12, 8, 10, 11], label: SALES_LABELS, type: 'bar' },
        ];
        break;
    }
  }

  public getAnalyticsclient(key) {
    this.clientYear = key;
  }

}
