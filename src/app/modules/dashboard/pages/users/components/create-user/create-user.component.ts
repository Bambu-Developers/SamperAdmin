import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { UsersService } from '../../services/users.service';
import { EMAIL_REGEX } from 'src/app/modules/account/data/data';
import { Router } from '@angular/router';
import { PermisionsModel } from '../../models/permisions.model';
import { USERS_LANGUAGE } from '../../data/language';
import { ROLES, PERMISIONS } from '../../data/data';
import { RolModel } from '../../models/rol.model';
import { RouteModel } from '../../models/routes.model';
import { Subscription } from 'rxjs';

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
    { name: this.lanUser.permisions.createEditPromotions, id: PERMISIONS.CREATE_EDIT_PROMOTIONS }
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
    private usersService: UsersService
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
        Validators.email,
        Validators.pattern(EMAIL_REGEX),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(16),
      ])
    }, Validators.required);
    this.getRoutes();
  }

  public createUser() {
    this.createUserForm.get('permision').patchValue(this.selectPermisions);
    if (this.createUserForm.valid) {
      this.usersService.createUser(this.createUserForm.value).then(
        error => {
          if (error && error.code === 'auth/email-already-in-use') {
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
          this.selectPermisions.price_edition = true : this.selectPermisions.create_edit_promotions = true;
    } else {
      id === 1 ?
        this.selectPermisions.user_registration = false :
        (id === 2) ?
          this.selectPermisions.price_edition = false : this.selectPermisions.create_edit_promotions = false;
    }
  }

  public getRoutes() {
    this.subscriptionRoutes = this.usersService.getAllRoutes().subscribe(
      res => {
        this.routes = res;
      }
    );
  }

  ngOnDestroy() {
    this.subscriptionRoutes.unsubscribe();
  }

}
