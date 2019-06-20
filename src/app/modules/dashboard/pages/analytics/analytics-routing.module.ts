import { ClientsAnalyticsComponent } from './components/clients-analytics/clients-analytics.component';
import { AnalyticsComponent } from './analytics.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent,
  },
  {
    path: 'clients',
    component: ClientsAnalyticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
