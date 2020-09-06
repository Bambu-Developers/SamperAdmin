import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTE_LANGUAGE } from './../../data/language';
import { ACCOUNT_LANGUAGE } from './../../../../../account/data/language';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../users/services/users.service';
import { RoutesService } from '../../services/routes.service';
import { SNACKBAR_CONFIG } from '../../../products/data/data';

@Component({
  selector: 'app-edit-route',
  templateUrl: './edit-route.component.html',
  styleUrls: ['./edit-route.component.scss']
})
export class EditRouteComponent implements OnInit, OnDestroy {

  public lanRoute = ROUTE_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public id: any;
  public dataSource: any;
  public editRouteForm: FormGroup;
  private _userSubscription: Subscription;
  private _routeSubscription: Subscription;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _userService: UsersService,
    private _routeService: RoutesService
  ) { }

  ngOnInit() {
    this.getRoute();
    this.editRouteForm = new FormGroup({
      name: new FormControl('')
    });
  }

  public getRoute() {
    const params = this._route.snapshot.params;
    this.id = params['id'];
    this._routeSubscription = this._routeService.getRoute(this.id).subscribe(route => {
      this.dataSource = route;
      this.editRouteForm.get('name').patchValue(route.name);
    });
  }

  public editRoute() {
    this._routeService.editRoute(this.editRouteForm.value, this.id);
    this.openSnackBar();
    this._router.navigate(['/dashboard/routes/']);
  }

  public openSnackBar() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: this.lanRoute.snackbarEdited
      }
    });
  }

  ngOnDestroy() {
    if (this._routeSubscription) {
      this._routeSubscription.unsubscribe();
    }
    if (this._userSubscription) {
      this._userSubscription.unsubscribe();
    }
  }

}
