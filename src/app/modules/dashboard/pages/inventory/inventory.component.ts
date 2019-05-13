import { Component, OnInit, OnDestroy } from '@angular/core';
import { INVENTORY_LANGUAGE } from './data/language';
import { MatTableDataSource } from '@angular/material';
import { ClientsService } from './../clients/services/clients.service';
import { InventoryService } from './services/inventory.service';
import { Subscription } from 'rxjs';
import { RouteModel } from '../clients/models/route.model';
import { Router } from '@angular/router';
import { PAGINATION } from 'src/app/modules/shared/components/paginator/data/data';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {

  public lanInv = INVENTORY_LANGUAGE;
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = ['sku', 'image', 'name', 'quantity', 'brand', 'category'];
  public routes: RouteModel[];
  public pagination = PAGINATION;
  public routeSelected = false;
  public commissionCalc = false;
  public user: any;
  public liquidation: any;
  private _subscriptionInventories: Subscription;
  private _subscriptionRoutes: Subscription;
  private _allInventories: any;

  constructor(
    private _inventoryService: InventoryService,
    private _clientService: ClientsService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.getInventories();
    this.getRoutes();
  }

  public getInventories() {
    const inventories = this.dataSource.data;
    this._subscriptionInventories = this._inventoryService.getInventories().snapshotChanges().subscribe(actions => {
      actions.forEach(action => {
        this._allInventories = this._inventoryService.getInventoriesFromKeys(action.key).valueChanges();
        this._allInventories.subscribe(res => {
          res.forEach(element => {
            element['uid'] = action.key;
            inventories.push(element);
          });
          this.dataSource.data = inventories;
        });
      });
      console.log(this.dataSource.data);
    });
  }

  public getRoutes() {
    this._subscriptionRoutes = this._clientService.getAllRoutes().subscribe(
      res => {
        this.routes = res;
        console.log(this.routes);
      }
    );
  }

  public doFilter(value: string) {
    this.liquidation = value;
    console.log(this.liquidation);
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public doLiquidation() {
    this._router.navigate(['/dashboard/inventory/liquidation/' + this.liquidation]);
  }

  ngOnDestroy() {
    if (this._subscriptionInventories) {
      this._subscriptionInventories.unsubscribe();
    }
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
  }

}
