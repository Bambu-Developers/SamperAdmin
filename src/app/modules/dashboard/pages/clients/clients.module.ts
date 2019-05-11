import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { ClientsRoutingModule } from 'src/app/modules/dashboard/pages/clients/clients-routing.module';

/*MODULES*/
import { SharedModule } from 'src/app/modules/shared/shared.module';

/*COMPONENTS*/
import { ClientsComponent } from 'src/app/modules/dashboard/pages/clients/clients.component';
import { ViewClientComponent } from './components/view-client/view-client.component';
import { CreateClientComponent } from './components/create-client/create-client.component';

@NgModule({
  declarations: [ClientsComponent, ViewClientComponent, CreateClientComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule
  ]
})
export class ClientsModule { }
