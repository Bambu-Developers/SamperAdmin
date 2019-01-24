import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { DashboardRoutingModule } from './dashboard-routing.module';

/*MATERIAL & ANGULAR*/
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

/*COMPONENTS*/
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UsersComponent } from './pages/users/users.component';
import { PaginatorComponent } from './components/paginator/paginator.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    UsersComponent,
    PaginatorComponent
  ],
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
    MatListModule,
    MatMenuModule,
    MatPaginatorModule
  ],
  exports: [PaginatorComponent]
})
export class DashboardModule { }
