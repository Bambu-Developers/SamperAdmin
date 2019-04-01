import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { ClientsRoutingModule } from 'src/app/modules/dashboard/pages/clients/clients-routing.module';

/*MODULES*/
import { SharedModule } from 'src/app/modules/shared/shared.module';

/*COMPONENTS*/
import { ClientsComponent } from 'src/app/modules/dashboard/pages/clients/clients.component';
import { ViewClientComponent } from './components/view-client/view-client.component';

@NgModule({
  declarations: [ClientsComponent, ViewClientComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule
  ]
})
export class ClientsModule { }
