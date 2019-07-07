import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { CLIENTS_LANGUAGE } from './../../data/language';
import { ClientsService } from './../../services/clients.service';
import { SnackbarComponent } from './../../../../../shared/components/snackbar/snackbar.component';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';
import { RouteModel } from './../../../users/models/routes.model';
import { PHONE_MASK } from 'src/app/directives/currency-mask.directive';
import { EMAIL_REGEX } from 'src/app/modules/account/data/data';
import { MatSnackBar } from '@angular/material';
import { DAYS } from '../../data/days';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit, OnDestroy {

  public loading = false;
  public language = ACCOUNT_LANGUAGE;
  public lanClient = CLIENTS_LANGUAGE;
  public createClientForm: FormGroup;
  public routes: RouteModel[];
  public subscriptionRoutes: Subscription;
  public _subscriptionURL: Subscription;
  public base64textString: string;
  public imagePath: any;
  public imgURL: string | ArrayBuffer;
  public numberMask = PHONE_MASK;
  public days = DAYS;
  public imgChanged: boolean;

  constructor(
    private _clientService: ClientsService,
    private _snackBar: MatSnackBar,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.getRoutes();
    this.createClientForm = new FormGroup({
      photo: new FormControl(),
      name: new FormControl('', [
        Validators.required,
      ]),
      shop_name: new FormControl('', [
        Validators.required,
      ]),
      route: new FormControl('', [
        Validators.required,
      ]),
      phone: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_REGEX),
      ]),
      monday: new FormControl(''),
      tuesday: new FormControl(''),
      wednesday: new FormControl(''),
      thursday: new FormControl(''),
      friday: new FormControl(''),
      saturday: new FormControl(''),
      sunday: new FormControl(''),
    });
  }
  public getRoutes() {
    this.subscriptionRoutes = this._clientService.getAllRoutes().subscribe(
      res => {
        this.routes = res;
      }
    );
  }

  public createClient() {
    this.loading = true; // Add this line
    this.createClientForm.get('monday').patchValue(this.days[0].active);
    this.createClientForm.get('tuesday').patchValue(this.days[1].active);
    this.createClientForm.get('wednesday').patchValue(this.days[2].active);
    this.createClientForm.get('thursday').patchValue(this.days[3].active);
    this.createClientForm.get('friday').patchValue(this.days[4].active);
    this.createClientForm.get('saturday').patchValue(this.days[5].active);
    this.createClientForm.get('sunday').patchValue(this.days[6].active);
    if (this.imgChanged) {
      this.savePhoto().then(
        response => {
          this.createClientForm.get('photo').patchValue(response);
          this._clientService.createClient(this.createClientForm.value);
          this.openSnackBar();
          this._router.navigate(['/dashboard/clients']);
          this.loading = false;
        });
    } else {
      this._clientService.createClient(this.createClientForm.value);
      this.openSnackBar();
      this._router.navigate(['/dashboard/clients']);
      this.loading = false;
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

  public preview(files: any) {
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

  public onChange(isChecked: boolean, id: number) {
    this.days[id - 1].active = isChecked;
  }

  public openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: CLIENTS_LANGUAGE.snackbarCreate
      }
    });
  }

  ngOnDestroy() {
  }

}
