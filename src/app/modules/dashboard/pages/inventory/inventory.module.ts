import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*MODULES*/
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { HistoryComponent } from './components/history/history.component';
import { LiquidationComponent } from './components/liquidation/liquidation.component';
import { CommissionComponent } from './components/commission/commission.component';
import { HistoryLiquidationComponent } from './components/history-liquidation/history-liquidation.component';
import { TicketComponent } from './components/ticket/ticket.component';

@NgModule({
  declarations: [InventoryComponent, HistoryComponent, LiquidationComponent, CommissionComponent, HistoryLiquidationComponent, TicketComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }
