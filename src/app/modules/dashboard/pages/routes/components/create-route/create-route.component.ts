import { SNACKBAR_CONFIG } from './../../../users/data/data';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTE_LANGUAGE } from '../../data/language';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/modules/shared/services/users.service';
import { RouteService } from 'src/app/modules/shared/services/route.service';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit, OnDestroy {

  public lanRoute = ROUTE_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public users = [];
  public createRouteForm: FormGroup;
  private _userSubscription: Subscription;

  constructor(
    private _userService: UsersService,
    private _routeService: RouteService,
    private _snackBar: MatSnackBar,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getUsers();
    this.createRouteForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ])
    });
  }

  public getUsers() {
    this._userSubscription = this._userService.getAllUsers().subscribe(users => {
      users.forEach(user => {
        this.users.push(user);
      });
    });
  }

  public createRoute() {
    if (this.createRouteForm.valid) {
      this._routeService.createRoute(this.createRouteForm.value);
      this.openSnackBar();
      this._router.navigate(['/dashboard/routes']);
    }
  }

  public openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: this.lanRoute.snackbarCreate
      }
    });
  }

  ngOnDestroy() {
    if (this._userSubscription) {
      this._userSubscription.unsubscribe();
    }
  }

}
