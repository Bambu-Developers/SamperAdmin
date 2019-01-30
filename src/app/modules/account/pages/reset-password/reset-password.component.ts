import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { EMAIL_REGEX } from 'src/app/modules/account/data/data';
import { matchingPasswords } from 'src/app/directives/equal-to-validator.directive';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  public language = ACCOUNT_LANGUAGE;
  public resetForm: FormGroup;
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  public subscriptionParams: Subscription;
  public oobCode: string;
  public invalidCode: boolean;
  public sendResetPassword: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.subscriptionParams = this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      this.oobCode = params['oobCode'];
      const apiKey = params['apiKey'];
      if (!(mode === 'resetPassword' && this.oobCode && apiKey)) {
        this.router.navigate(['/']);
      }
    });
    this.resetForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(14),
      ]),
      passConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(16),
      ])
    }, matchingPasswords('password', 'passConfirm'));
  }

  public updateUserPassword() {
    if (this.resetForm.valid) {
      this.authService.updateUserPassword(this.resetForm.get('password').value, this.oobCode).then(
        res => this.sendResetPassword = true,
        error => {
          console.log(error);
          if (error.code === 'auth/invalid-action-code') { this.invalidCode = true; }
        }
      );
    }
  }

  ngOnDestroy() {
    this.subscriptionParams.unsubscribe();
  }

}
