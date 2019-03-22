import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { CURRENCY_MASK } from 'src/app/directives/currency-mask.directive';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent implements OnInit {

  public dataSource: any;
  public creditEditForm: FormGroup;
  public creditAssignForm: FormGroup;
  private _subscription: Subscription;
  private _subscriptionService: any;
  public id: string;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public lanClient = CLIENTS_LANGUAGE;
  public isAssignedCredit = false;
  public isEditCredit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _clientService: ClientsService,
  ) { }

  ngOnInit() {
    this.getClient();
    this.creditEditForm = new FormGroup({
      amountAssigned: new FormControl('', [
        Validators.required,
      ]),
      validityDate: new FormControl('', [
        Validators.required,
      ])
    });
    this.creditAssignForm = new FormGroup({
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
      this._subscriptionService = this._clientService.getClient(this.id).subscribe(
        res => {
          this.dataSource = res;
        });
    });
  }

  public editCredit() {
    if (this.creditEditForm.valid) {
      this._clientService.editCredit( this.creditEditForm.value, this.id );
      this.openSnackBarEdited();
    }
  }

  public assignCredit() {
    if (this.creditAssignForm.valid) {
      this._clientService.assignCredit( this.creditAssignForm.value, this.id );
      this.openSnackBarAssigned();
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

  ngOnDestroy() {
    // if (this._subscription) {
    //   this._subscription.unsubscribe();
    // }
    // if (this._subscriptionService) {
    //   this._subscriptionService.unsubscribe();
    // }
  }

}
