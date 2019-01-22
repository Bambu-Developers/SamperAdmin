import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EMAIL_REGEX } from '../data/data';
import { ACCOUNT_LANGUAGE } from '../data/language';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public language = ACCOUNT_LANGUAGE;
  public loginForm: FormGroup;
  public showPassword: boolean;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
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
    }, Validators.required);
  }

  public submit(value: { email: string; password: string; }) {
    this.authService.login(value.email, value.password).then(
      error => {
        if (error.code === 'auth/user-not-found') {
          this.loginForm.controls['email'].setErrors({'unauthorized': true});
        } else if ( error.code === 'auth/wrong-password' ) {
          this.loginForm.controls['password'].setErrors({'unauthorized': true});
        }
      }
    );
  }

}
