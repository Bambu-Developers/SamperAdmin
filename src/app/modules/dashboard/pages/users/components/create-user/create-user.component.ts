import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { UsersService } from '../../services/users.service';
import { EMAIL_REGEX } from 'src/app/modules/account/data/data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;
  public language = ACCOUNT_LANGUAGE;
  public selectedRol: number;
  public selectPermisions: Array<number> = [];
  public permisions: string[] = [
    'Alta de usuarios',
    'Edición de precios',
    'Creación y edición de promociones'
  ];

  constructor(
    private usersService: UsersService,
    private router: Router,
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
        Validators.minLength(8),
        Validators.maxLength(16),
      ])
    }, Validators.required);
  }

  public createUser() {
    if (this.createUserForm.valid) {
      this.usersService.createUser(this.createUserForm.value).then(
        res => {
          this.router.navigate(['/dashboard/users']);
        },
        error => {
          if (error && error.code === 'auth/email-already-in-use') {
            this.createUserForm.get('email').setErrors({ 'exists': true });
          }
        });
    }
  }

  public changePermisions(event: any) {
    if (event.checked) { this.selectPermisions.push(event.source.value); }
    this.createUserForm.get('permision').patchValue(this.selectPermisions);
  }

}
