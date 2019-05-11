import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { RouteModel } from '../../models/routes.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PermisionsModel } from '../../models/permisions.model';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { USERS_LANGUAGE } from '../../data/language';
import { PERMISIONS, SNACKBAR_CONFIG } from '../../data/data';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogComponent } from 'src/app/modules/shared/components/dialog/dialog.component';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public editUserForm: FormGroup;
  public subscriptionParams: Subscription;
  private idUser: string;
  public id;
  public user;
  public routes: RouteModel[];
  public language = ACCOUNT_LANGUAGE;
  public lanUser = USERS_LANGUAGE;
  public PERMISIONS = PERMISIONS;
  public subscriptionRoutes: Subscription;
  public selectPermisions = new PermisionsModel({
    user_registration: false,
    price_edition: false,
    create_edit_promotions: false
  });
  public permisions = [
    { name: this.lanUser.permisions.userRegistration, id: PERMISIONS.USER_REGISTRATION },
    { name: this.lanUser.permisions.priceEdition, id: PERMISIONS.PRICE_EDITION },
    // tslint:disable-next-line: max-line-length
    { name: this.lanUser.permisions.createEditPromotions, id: PERMISIONS.CREATE_EDIT_PROMOTIONS },
  ];

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.subscriptionParams = this.route.params.subscribe(params => {
      this.idUser = params['id'];
    });
    this.getUser();
    this.getRoutes();
    this.editUserForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      route: new FormControl(0),
      password: new FormControl('', [
        Validators.required
      ]),
      status: new FormControl(1, [
        Validators.required
      ]),
    }, Validators.required);
  }

  private getUser() {
    this.userService.getUser(this.idUser).subscribe(
      res => {
        this.user = res;
        this.id = res.id;
        if (this.user.rol === 0) {
          this.userService.getRouteByID(this.user.route).subscribe(route => {
            this.user.route_name = route.name;
          });
        }
        this.editUserForm.get('route').patchValue(this.user.route);
        this.editUserForm.get('name').patchValue(this.user.name);
        this.editUserForm.get('status').patchValue(this.user.status);
        this.selectPermisions = this.user.permision;
        console.log(this.user);
      },
      err => console.error(err)
    );
  }

  public editUser() {
    console.log(this.user);
    if (this.user.rol === 2) {
      this.user.permision = this.selectPermisions;
    }
    this.user.name = this.editUserForm.get('name').value;
    this.user.status = this.editUserForm.get('status').value;
    if (this.user.rol === 0) {
      this.user.route = this.editUserForm.get('route').value;
    }
    this.userService.editUserData(this.user).then(
      res => this._router.navigate(['/dashboard/users']),
      err => console.log(err)
    );
  }

  public getRoutes() {
    this.subscriptionRoutes = this.userService.getAllRoutes().subscribe(
      res => {
        this.routes = res;
      }
    );
  }

  public changePermisions(event: any, id: number) {
    if (event.checked) {
      id === 1 ?
        this.selectPermisions.user_registration = true :
        (id === 2) ?
          this.selectPermisions.price_edition = true : this.selectPermisions.create_edit_promotions = true;
    } else {
      id === 1 ?
        this.selectPermisions.user_registration = false :
        (id === 2) ?
          this.selectPermisions.price_edition = false : this.selectPermisions.create_edit_promotions = false;
    }
  }

  public deleteUser() {
    this.userService.deleteUser(this.id).then(
      res => this._router.navigate(['/dashboard/users/']),
      err => console.log(err)
    );
    this.openSnackBarDeleted();
  }

  public setDisponibility(event) {
    if (event.checked === true) {
      this.userService.setDisponibility(this.id, event.checked);
    } else {
      this.openDialogDisable(event.checked);
    }
  }

  public openDialogDisable(eventValue) {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        text: this.lanUser.dialogDisable,
        accept: true,
        action: this.lanUser.disable
      }
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.userService.setDisponibility(this.id, eventValue);
          this.openSnackBarDisable();
        }
      }
    );
  }

  public openDialogDelete() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        text: this.lanUser.dialogDelete,
        accept: true,
        action: this.lanUser.delete
      }
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.deleteUser();
        }
      }
    );
  }

  public openSnackBarDeleted() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: this.lanUser.snackbarDeleted
      }
    });
  }

  public openSnackBarDisable() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: this.lanUser.snackbarDisable
      }
    });
  }

}
