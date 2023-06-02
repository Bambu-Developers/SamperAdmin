import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { EMAIL_REGEX } from 'src/app/modules/account/data/data';
import { Router } from '@angular/router';
import { PermisionsModel } from '../../models/permisions.model';
import { USERS_LANGUAGE } from '../../data/language';
import { ROLES, PERMISIONS } from '../../data/data';
import { RolModel } from '../../models/rol.model';
import { RouteModel } from '../../models/routes.model';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/modules/shared/services/users.service';
import { RouteService } from 'src/app/modules/shared/services/route.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  public language = ACCOUNT_LANGUAGE;
  public lanUser = USERS_LANGUAGE;
  public ROLES = ROLES;
  public PERMISIONS = PERMISIONS;

  public createUserForm: FormGroup;
  public selectedRol: number;
  public selectPermisions = new PermisionsModel({
    user_registration: false,
    price_edition: false,
    create_edit_promotions: false
  });

  public permisions = [
    { name: this.lanUser.permisions.userRegistration, id: PERMISIONS.USER_REGISTRATION },
    { name: this.lanUser.permisions.priceEdition, id: PERMISIONS.PRICE_EDITION },
  ];
  public roles = [
    { name: this.lanUser.admin, id: ROLES.ADMIN },
    { name: this.lanUser.storer, id: ROLES.STORER },
    { name: this.lanUser.vendor, id: ROLES.VENDOR }
  ];
  public routes: RouteModel[];
  public showPassword = false;
  public subscriptionRoutes: Subscription;

  constructor(
    private usersService: UsersService,
    private routeService: RouteService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.createUserForm = new FormGroup({
      rol: new FormControl('', [
        Validators.required
      ]),
      route: new FormControl(''),
      permision: new FormControl(''),
      name: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(14),
      ])
    }, Validators.required);
    this.getRoutes();
  }

  public createUser() {
    this.createUserForm.get('permision').patchValue(this.selectPermisions);
    this.createUserForm.get('rol').patchValue(this.selectedRol);
    if (this.createUserForm.valid) {
      this.usersService.createUser(this.createUserForm.value).then(
        error => {
          this._router.navigate(['/dashboard/users']);
          if (error.code === 'auth/email-already-in-use') {
            this.createUserForm.get('email').setErrors({ 'exists': true });
          }
        });

    }
  }

  public changePermisions(event: any, id: number) {

    if (event.checked) {
      id === 1 ?
        this.selectPermisions.user_registration = true :
        (id === 2) ?
          this.selectPermisions.price_edition = true :
          this.selectPermisions.create_edit_promotions = true;
    } else {
      id === 1 ?
        this.selectPermisions.user_registration = false :
        (id === 2) ?
          this.selectPermisions.price_edition = false : this.selectPermisions.create_edit_promotions = false;
    }
  }

  public getRoutes() {
    this.subscriptionRoutes = this.routeService.getAllRoutes().subscribe(
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

  ngOnDestroy() {
    this.subscriptionRoutes.unsubscribe();
  }

}
