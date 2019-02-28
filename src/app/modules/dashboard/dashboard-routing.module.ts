import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { ProductsComponent } from './pages/products/products.component';

const routes: Routes = [
  {
    path: 'products',
    component: DashboardComponent,
    loadChildren: './pages/products/products.module#ProductsModule'
  },
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
