import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;
  public language = ACCOUNT_LANGUAGE;
  public selectedRol: number;
  public permisions: string[] = ['Alta de usuarios', 'Edición de precios', 'Creación y edición de promociones'];

  constructor() { }

  ngOnInit() {
    this.createUserForm = new FormGroup({
      rol: new FormControl('', [
        Validators.required
      ]),
      route: new FormControl('', [
        Validators.required
      ]),
      permision: new FormControl('', [
        Validators.required
      ]),
      name: new FormControl('', [
        Validators.required,
      ]),
      username: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ])
    }, Validators.required);
  }

}
