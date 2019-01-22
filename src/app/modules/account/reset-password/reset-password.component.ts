import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EMAIL_REGEX } from '../data/data';
import { matchingPasswords } from 'src/app/directives/equal-to-validator.directive';
import { ACCOUNT_LANGUAGE } from '../data/language';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public language = ACCOUNT_LANGUAGE;
  public resetForm: FormGroup;
  public showPassword: boolean;
  public showConfirmPassword: boolean;

  constructor() { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(14),
      ]),
      passConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(14),
      ])
    }, matchingPasswords('password', 'passConfirm'));
  }

}
