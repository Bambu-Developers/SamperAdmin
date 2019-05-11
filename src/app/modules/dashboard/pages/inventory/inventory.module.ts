import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*MODULES*/
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { HistoryComponent } from './components/history/history.component';
import { LiquidationComponent } from './components/liquidation/liquidation.component';
import { TrackingComponent } from './components/tracking/tracking.component';

@NgModule({
  declarations: [InventoryComponent, HistoryComponent, LiquidationComponent, TrackingComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }
