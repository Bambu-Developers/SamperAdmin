import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EMAIL_REGEX } from 'src/app/modules/account/data/data';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {

  public language = ACCOUNT_LANGUAGE;
  public recoverForm: FormGroup;
  public sendEmail = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.recoverForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(EMAIL_REGEX),
      ])
    });
  }

  public forgetPassword() {
    if (this.recoverForm.valid) {
      this.authService.ForgotPassword(this.recoverForm.get('email').value).then(
        res => this.sendEmail = true,
        error => {
          if (error.code === 'auth/user-not-found') {
            this.recoverForm.controls['email'].setErrors({ 'unauthorized': true });
          }
        });
    }
  }

}
