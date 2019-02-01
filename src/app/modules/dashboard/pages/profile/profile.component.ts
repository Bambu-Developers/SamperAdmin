import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../users/services/users.service';
import { AuthService } from 'src/app/modules/account/services/auth.service';
import { matchingPasswords } from 'src/app/directives/equal-to-validator.directive';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { MatSnackBar } from '@angular/material';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public language = ACCOUNT_LANGUAGE;
  public showConfirmPassword = false;
  public showNewPassword = false;
  public showPassword = false;
  public email: string;
  public passwordForm: FormGroup;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.email = this.authService.getUser();
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(14),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(14),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(14),
      ])
    }, matchingPasswords('newPassword', 'confirmPassword'));
  }

  public updateUserPassword() {
    if (this.passwordForm.valid) {
      this.userService.updateUserPassword(this.email, this.passwordForm.value).then(
        res => {
          this.openSnackBar();
        },
        error => {
          if (error.code === 'auth/wrong-password') {
            this.passwordForm.controls['currentPassword'].setErrors({ 'unauthorized': true });
          }
        }
      );
    }
  }

  openSnackBar() {
    this.snackBar.openFromComponent(ToastComponent, {
      duration: 50000,
      data: {message: 'Se ha cambiado la contraseña exitosamente'}
    });
  }

}
