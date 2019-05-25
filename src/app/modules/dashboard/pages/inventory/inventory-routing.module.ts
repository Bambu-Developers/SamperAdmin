import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { HistoryComponent } from './components/history/history.component';
import { LiquidationComponent } from './components/liquidation/liquidation.component';
import { CommissionComponent } from './components/commission/commission.component';
import { HistoryLiquidationComponent } from './components/history-liquidation/history-liquidation.component';
import { TicketComponent } from './components/ticket/ticket.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
  {
    path: 'liquidation/:id',
    component: LiquidationComponent,
  },
  {
    path: 'commission',
    component: CommissionComponent,
  },
  {
    path: 'ticket',
    component: TicketComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
