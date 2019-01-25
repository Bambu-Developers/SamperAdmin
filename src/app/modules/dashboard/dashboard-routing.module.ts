import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {
    path: 'users',
    component: DashboardComponent,
    loadChildren: './pages/users/users.module#UsersModule'
  },
  {
    path: 'clients',
    component: DashboardComponent,
    loadChildren: './pages/clients/clients.module#ClientsModule'
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
