import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ViewClientComponent } from 'src/app/modules/dashboard/pages/clients/components/view-client/view-client.component';
const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
  },
  {
    path: 'view/:id',
    component: ViewClientComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
