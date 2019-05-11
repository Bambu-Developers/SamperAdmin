import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { HistoryComponent } from './components/history/history.component';
import { LiquidationComponent } from './components/liquidation/liquidation.component';
import { TrackingComponent } from './components/tracking/tracking.component';

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
    path: 'liquidation',
    component: LiquidationComponent,
  },
  {
    path: 'tracking',
    component: TrackingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
