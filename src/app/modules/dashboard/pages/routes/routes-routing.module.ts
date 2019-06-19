import { CreateRouteComponent } from './components/create-route/create-route.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutesComponent } from './routes.component';
import { EditRouteComponent } from './components/edit-route/edit-route.component';

const routes: Routes = [
  {
    path: '',
    component: RoutesComponent,
  },
  {
    path: 'create',
    component: CreateRouteComponent,
  },
  {
    path: 'edit/:id',
    component: EditRouteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
