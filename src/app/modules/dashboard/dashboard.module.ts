import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { DashboardRoutingModule } from './dashboard-routing.module';

/*COMPONENTS*/
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';

/*MODULES*/
import { SharedModule } from '../shared/shared.module';
import { CreditComponent } from './pages/credit/credit.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    CreditComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule {}
