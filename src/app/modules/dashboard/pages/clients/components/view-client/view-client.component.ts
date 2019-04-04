import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar, DateAdapter } from '@angular/material';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { CURRENCY_MASK } from 'src/app/directives/currency-mask.directive';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';
import { DateFormat } from 'src/app/modules/dashboard/data/date-format.data';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [{provide: DateAdapter, useClass: DateFormat}],
})
export class ViewClientComponent implements OnInit {

  public dataSource: any;
  public creditEditForm: FormGroup;
  public creditAssignForm: FormGroup;
  private _subscription: Subscription;
  private _subscriptionService: Subscription;
  public id: string;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public lanClient = CLIENTS_LANGUAGE;
  public isAssignedCredit = false;
  public isEditCredit = false;
  public minDate = new Date();
  public maxDate = new Date(2021, 11, 31);
  public hardc = {
    wholesale: 'Mayorista',
    amount9: '$9,500.00 MXN',
    amount6: '$6,500.00 MXN',
    amount5: '$5,000.00 MXN',
    amount3: '$3,500.00 MXN',
    amount1: '$1,500.00 MXN',
    date: '20 / Ago / 2018',
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _clientService: ClientsService,
    private _dateAdapter: DateAdapter<Date>
  ) {
    this._dateAdapter.setLocale('es-ES');
  }

  ngOnInit() {
    this.getClient();
    this.creditEditForm = new FormGroup({
      amountAssigned: new FormControl('', [
        Validators.required,
      ]),
      validityDate: new FormControl(new Date, [
        Validators.required,
      ])
    });
    this.creditAssignForm = new FormGroup({
      amountAssigned: new FormControl('', [
        Validators.required,
      ]),
      validityDate: new FormControl(new Date, [
        Validators.required,
      ])
    });
  }

  public getClient() {
    this._subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this._subscriptionService = this._clientService.getClient(this.id).subscribe(
        res => {
          this.dataSource = res;
          this._clientService.getRouteByID(this.dataSource.route_id).subscribe(route => {
            this.dataSource.route_name = route.name;
          });
        }
      );
    });
  }

  public editCredit() {
    if (this.creditEditForm.valid) {
      this._clientService.editCredit(this.creditEditForm.value, this.id);
      this.openSnackBarEdited();
      this.router.navigate(['/dashboard/clients/view/' + this.id]);
    }
  }

  public assignCredit() {
    if (this.creditAssignForm.valid) {
      this._clientService.assignCredit(this.creditAssignForm.value, this.id);
      this.openSnackBarAssigned();
      this.router.navigate(['/dashboard/clients/view/' + this.id]);
    }
  }

  public openSnackBarEdited() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: CLIENTS_LANGUAGE.snackbarEdited
      }
    });
  }

  public openSnackBarAssigned() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: CLIENTS_LANGUAGE.snackbarAssignedCredit
      }
    });
  }

  OnDestroy() {
    this._subscription.unsubscribe();
    this._subscriptionService.unsubscribe();
  }
}
