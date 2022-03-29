import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CreditComponent } from './pages/credit/credit.component';

const routes: Routes = [
  {
    path: 'inventory',
    component: DashboardComponent,
    loadChildren: './pages/inventory/inventory.module#InventoryModule'
  },
  {
    path: 'analytics',
    component: DashboardComponent,
    loadChildren: './pages/analytics/analytics.module#AnalyticsModule'
  },
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
    path: 'profile',
    component: DashboardComponent,
    loadChildren: './pages/profile/profile.module#ProfileModule'
  },
  {
    path: 'routes',
    component: DashboardComponent,
    loadChildren: './pages/routes/routes.module#RoutesModule'
  },
  {
    path: 'credit', component: DashboardComponent,
    loadChildren: './pages/credit/credit.module#CreditModule' },
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
