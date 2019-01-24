import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';

/*MATERIAL & ANGULAR*/
import {
  MatTableModule
} from '@angular/material';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    PaginatorComponent
  ]
})
export class UsersModule { }
