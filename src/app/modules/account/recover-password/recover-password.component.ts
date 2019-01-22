import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EMAIL_REGEX } from '../data/data';
import { ACCOUNT_LANGUAGE } from '../data/language';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  public language = ACCOUNT_LANGUAGE;
  public recoverForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_REGEX),
      ])
    });
  }

}
