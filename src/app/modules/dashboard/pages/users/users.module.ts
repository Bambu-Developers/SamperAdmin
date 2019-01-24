import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';

/*MATERIAL & ANGULAR*/
import {
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { DashboardModule } from '../../dashboard.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    PaginatorComponent,
    DashboardModule
  ]
})
export class UsersModule { }
