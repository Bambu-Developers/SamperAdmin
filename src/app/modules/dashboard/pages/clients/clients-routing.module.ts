import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ViewClientComponent } from 'src/app/modules/dashboard/pages/clients/components/view-client/view-client.component';
import { CreateClientComponent } from 'src/app/modules/dashboard/pages/clients/components/create-client/create-client.component';


const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
  },
  {
    path: 'view/:id',
    component: ViewClientComponent,
  },
  {
    path: 'create',
    component: CreateClientComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
