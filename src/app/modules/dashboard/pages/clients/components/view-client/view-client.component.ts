import { Component, OnInit, OnDestroy , AfterViewInit , ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';
import { CURRENCY_MASK } from 'src/app/directives/currency-mask.directive';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';
import { DateFormat } from 'src/app/modules/dashboard/data/date-format.data';
import { RouteModel } from '../../models/route.model';
import { DAYS } from '../../data/days';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogComponent } from 'src/app/modules/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [{ provide: DateAdapter, useClass: DateFormat }],
})
export class ViewClientComponent implements OnInit , AfterViewInit {

  public dataSource: any;
  public dataSourceVisits = new MatTableDataSource();
  public creditEditForm: FormGroup;
  public creditAssignForm: FormGroup;
  public editClientForm: FormGroup;
  public editClientFormCredit: FormGroup;
  public id: string;
  public language = ACCOUNT_LANGUAGE;
  public currencyMask = CURRENCY_MASK;
  public lanClient = CLIENTS_LANGUAGE;
  public isAssignedCredit = false;
  public isEditCredit = false;
  public isEditClient = false;
  public minDate = new Date();
  public maxDate = new Date(2021, 11, 31);
  public base64textString: any;
  public imagePath: any;
  public imgURL: any;
  public imgChanged = false;
  public loading = false;
  public routes: RouteModel[];
  public days = DAYS;
  public currentDays = new Array();
  public hardc = {
    wholesale: 'Mayorista',
    amount9: '$9,500.00 MXN',
    amount6: '$6,500.00 MXN',
    amount5: '$5,000.00 MXN',
    amount3: '$3,500.00 MXN',
    amount1: '$1,500.00 MXN',
    date: '20 / Ago / 2018',
  };
  public displayedColumns: string[] = ['bender_id', 'shop_name', 'name', 'route_id'];
  private _subscription: Subscription;
  private _subscriptionURL: Subscription;
  private _subscriptionService: Subscription;
  private _subscriptionRoutes: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _clientService: ClientsService,
    private _dateAdapter: DateAdapter<Date>
  ) {
    this._dateAdapter.setLocale('es-ES');
  }



  ngOnInit() {

    this.getClient();
    this.getRoutes();
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
    this.editClientForm = new FormGroup({
      photo: new FormControl(),
      name: new FormControl('', [
        Validators.required,
      ]),
      shop_name: new FormControl('', [
        Validators.required,
      ]),
      phone: new FormControl('', [
        Validators.required,
      ]),
      route: new FormControl(''),
      monday: new FormControl(''),
      tuesday: new FormControl(''),
      wednesday: new FormControl(''),
      thursday: new FormControl(''),
      friday: new FormControl(''),
      saturday: new FormControl(''),
      sunday: new FormControl(''),
    });

    this.editClientFormCredit = new FormGroup({
      haveCredit: new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.dataSourceVisits.paginator = this.paginator;
  }

  public getClient() {
    this._subscription = this.route.params.subscribe(params => {
      this.id = params['id'];
      this._subscriptionService = this._clientService.getClient(this.id).subscribe(
        (res: any ) => {

          this.dataSource = res;
          // this.currentDays.push(res.monday);
          // this.currentDays.push(res.tuesday);
          // this.currentDays.push(res.wednesday);
          // this.currentDays.push(res.thursday);
          // this.currentDays.push(res.friday);
          // this.currentDays.push(res.saturday);
          // this.currentDays.push(res.sunday);
          // for (let i = 0; i < this.days.length; i++) {
          //   this.days[i].active = this.currentDays[i];
          // }
          this.editClientFormCredit.get('haveCredit').patchValue(res.haveCredit === false || res.haveCredit === true
            ? res.haveCredit : false );
          if (res.photo !== '') {
            this.editClientForm.get('photo').patchValue(res.photo);
          }
          this.editClientForm.get('name').patchValue(res.name);
          this.editClientForm.get('shop_name').patchValue(res.shop_name);
          this.editClientForm.get('phone').patchValue(res.phone);
          this.editClientForm.get('route').patchValue(res.route_id);
          if (res.route_id !== '') {
            this._clientService.getRouteByID(res['route_id']).subscribe(route => {
              if (route !== null) {
                res['route_name'] = route.name;
              }
            });
          }
          this.getDays();
        }
      );

      this._clientService.getVisits( this.id ).subscribe(ress => {
        this.dataSourceVisits.data = ress;
      });

    });
  }

  public getDays() {
    this.currentDays = [];
    this.currentDays.push(this.dataSource.monday);
    this.currentDays.push(this.dataSource.tuesday);
    this.currentDays.push(this.dataSource.wednesday);
    this.currentDays.push(this.dataSource.thursday);
    this.currentDays.push(this.dataSource.friday);
    this.currentDays.push(this.dataSource.saturday);
    this.currentDays.push(this.dataSource.sunday);
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].active = this.currentDays[i];
    }
  }

  public getRoutes() {
    this._subscriptionRoutes = this._clientService.getAllRoutes().subscribe(
      res => {
        this.routes = res.sort((r1, r2) => {
          if (r1.name < r2.name) {
            return -1;
          }
          if (r1.name > r2.name) {
            return 1;
          }
          return 0;
        });
      }
    );
  }

  public editCredit() {
    if (this.creditEditForm.valid) {
      this._clientService.editCredit(this.creditEditForm.value, this.id);
      this.getDays();
      this.openSnackBarEdited();
      this.router.navigate(['/dashboard/clients/view/' + this.id]);
    }
  }

  public editClient() {
    this.loading = true;
    this.editClientForm.get('monday').setValue(this.days[0].active);
    this.editClientForm.get('tuesday').setValue(this.days[1].active);
    this.editClientForm.get('wednesday').patchValue(this.days[2].active);
    this.editClientForm.get('thursday').patchValue(this.days[3].active);
    this.editClientForm.get('friday').patchValue(this.days[4].active);
    this.editClientForm.get('saturday').patchValue(this.days[5].active);
    this.editClientForm.get('sunday').patchValue(this.days[6].active);
    const dataAux: any = this.editClientForm.value;
    // dataAux.haveCredit = {
    //   credit: this.editClientFormCredit.get('haveCredit').value,
    //   // debt: this.dataSource.haveCredit.debt ? this.dataSource.haveCredit.debt : 0,
    //   // paid: this.dataSource.haveCredit.paid ? this.dataSource.haveCredit.paid : 0
    // };
    dataAux.haveCredit = this.editClientFormCredit.get('haveCredit').value;
    if (this.imgChanged) {
      this.savePhoto().then(
        response => {
          this.editClientForm.get('photo').patchValue(response);
          this._clientService.editClient(dataAux, this.id);
          this.openSnackBarClientEdited();
          this.isEditClient = false;
          this.loading = false;
        }, error => console.error(error)
      );
    } else {
      this._clientService.editClient(dataAux, this.id);
      this.openSnackBarClientEdited();
      this.isEditClient = false;
      this.loading = false;
    }
    this.getClient();
  }

  public assignCredit() {
    if (this.creditAssignForm.valid) {
      this._clientService.assignCredit(this.creditAssignForm.value, this.id);
      this.openSnackBarAssigned();
      this.router.navigate(['/dashboard/clients/view/' + this.id]);
    }
  }

  public handleFileSelect(event) {
    const files = event.target.files;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(file);
  }

  public _handleReaderLoaded(readerEvent) {
    const binaryString = readerEvent.target.result;
    this.base64textString = btoa(binaryString);
  }

  public preview(files) {
    if (files.length === 0) {
      return;
    }
    const MIME_TYPE = files[0].type;
    if (MIME_TYPE.match(/image\/*/) == null) {
      // mat-error
      return;
    }
    const READER = new FileReader();
    this.imagePath = files;
    READER.readAsDataURL(files[0]);
    READER.onload = (_event) => {
      this.imgURL = READER.result;
    };
    this.imgChanged = true;
  }

  public savePhoto() {
    return new Promise((resolve, reject) => {
      this._clientService.imageUpload(this.base64textString).then(
        response => {
          this._subscriptionURL = response.subscribe(
            url => resolve(url),
            error => console.error(error)
          );
        },
        error => reject(error)
      );
    });
  }

  public onChange(isChecked: boolean, id: number) {
    this.days[id - 1].active = isChecked;
  }

  public openSnackBarClientEdited() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: CLIENTS_LANGUAGE.snackbarClientEdited
      }
    });
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

  public openDialogDeleteClient() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        text: CLIENTS_LANGUAGE.dialogDeleteClient,
        accept: true,
        action: CLIENTS_LANGUAGE.delete
      }
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.deleteClient();
        }
      }
    );
  }

  public deleteClient() {
    this._clientService.deleteClient(this.id);
    this.router.navigate(['/dashboard/clients/']);
    this.openSnackBarClientDeleted();
  }

  public openSnackBarClientDeleted() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: CLIENTS_LANGUAGE.snackbarClientDeleted
      }
    });
  }


  OnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscriptionService) {
      this._subscriptionService.unsubscribe();
    }
    if (this._subscriptionURL) {
      this._subscriptionURL.unsubscribe();
    }
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
  }

}
