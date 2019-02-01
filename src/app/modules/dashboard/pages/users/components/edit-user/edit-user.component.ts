import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { PermisionsModel } from '../../models/permisions.model';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { USERS_LANGUAGE } from '../../data/language';
import { PERMISIONS } from '../../data/data';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public editUserForm: FormGroup;
  public subscriptionParams: Subscription;
  private idUser: string;
  public user: UserModel;
  public language = ACCOUNT_LANGUAGE;
  public lanUser = USERS_LANGUAGE;
  public PERMISIONS = PERMISIONS;
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

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscriptionParams = this.route.params.subscribe(params => {
      this.idUser = params['id'];
    });
    this.getUser();
    this.editUserForm = new FormGroup({
      user: new FormControl('', [
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
        this.editUserForm.get('user').patchValue(this.user.name);
        this.editUserForm.get('status').patchValue(this.user.status);
        this.selectPermisions = this.user.permision;
      },
      err => console.error(err)
    );
  }

  public editUser() {
    if (this.editUserForm.valid) {
      this.user.permision = this.selectPermisions;
      this.user.name = this.editUserForm.get('user').value;
      this.user.status = this.editUserForm.get('status').value;
      this.user.route = this.editUserForm.get('route').value;
      this.userService.editUserData(this.user).then(
        res => this.router.navigate(['/dashboard/users']),
        err => console.log(err)
      );
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

}
