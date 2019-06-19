import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { RoutesComponent } from './routes.component';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { EditRouteComponent } from './components/edit-route/edit-route.component';

@NgModule({
  declarations: [RoutesComponent, CreateRouteComponent, EditRouteComponent],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    SharedModule
  ]
})
export class RoutesModule { }
