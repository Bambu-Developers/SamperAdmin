import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { CURRENCY_MASK } from 'src/app/directives/currency-mask.directive';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent implements OnInit {

  public dataSource: any;
  public editCreditForm: FormGroup;
  private _subscription: Subscription;
  private _subscriptionService: any;
  public id: string;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public lanClient = CLIENTS_LANGUAGE;
  public assignedCredit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _clientService: ClientsService,
  ) { }

  ngOnInit() {
    this.getClient();
    this.editCreditForm = new FormGroup({
      amountAssigned: new FormControl('', [
        Validators.required,
      ]),
      validityDate: new FormControl('', [
        Validators.required,
      ])
    });
  }

  public getClient() {
    this._subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this._subscriptionService = this._clientService.getProduct(this.id).subscribe(
        res => {
          this.dataSource = res;
        });
    });
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
