import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { ClientsAnalyticsComponent } from './components/clients-analytics/clients-analytics.component';

@NgModule({
  declarations: [AnalyticsComponent, ClientsAnalyticsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    SharedModule
  ]
})
export class AnalyticsModule { }
