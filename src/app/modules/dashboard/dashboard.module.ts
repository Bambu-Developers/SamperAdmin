import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { DashboardRoutingModule } from './dashboard-routing.module';

/*MATERIAL & ANGULAR*/
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatIconModule,
  MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule,
} from '@angular/material';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class DashboardModule { }
