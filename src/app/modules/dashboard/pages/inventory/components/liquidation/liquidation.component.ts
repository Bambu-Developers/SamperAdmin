import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INVENTORY_LANGUAGE } from '../../data/language';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../users/services/users.service';

@Component({
  selector: 'app-liquidation',
  templateUrl: './liquidation.component.html',
  styleUrls: ['./liquidation.component.scss']
})
export class LiquidationComponent implements OnInit, OnDestroy {

  public lanLiq = INVENTORY_LANGUAGE.liquidation;
  public uid: string;
  public user: any;
  public id: string;
  public dataSource: any;
  public displayedColumns = ['sku', 'name', 'quantity', 'brand', 'subtotal'];
  private _subscription: Subscription;
  private _subscriptionService: any;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UsersService,
  ) { }

  ngOnInit() {
    this.getUser();
    this.getInventory();
  }

  public getUser() {
    this._subscription = this._route.params.subscribe(params => {
      this.id = params['id'];
      this._subscriptionService = this._userService.getUser(this.id).subscribe(
        res => {
          this.dataSource = res;
        });
    });
  }

  public getInventory() {

  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscriptionService) {
      this._subscriptionService.unsubscribe();
    }
  }

}
