import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EMAIL_REGEX } from '../data/data';
import { ACCOUNT_LANGUAGE } from '../data/language';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public language = ACCOUNT_LANGUAGE;
  public loginForm: FormGroup;
  public showPassword: boolean;

  constructor() {
    this.loginForm = new FormGroup({
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
    });
  }

  ngOnInit() {
    // this.loginForm.controls['email'].setErrors({'unauthorized':true,'required':false,'email':false});
  }

}
