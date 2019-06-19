import { UsersService } from './../../dashboard/pages/users/services/users.service';
import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usersRef: AngularFireList<any>;
  user: Observable<firebase.User>;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.user = afAuth.authState;
    const user = this.afAuth.auth.currentUser;
    this.usersRef = db.list('Users');
  }

  // Sign in with email/password
  public login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          resolve(result);
          localStorage.setItem('user', JSON.stringify(result.user));
          this.updateUserData(result.user);
        })
        .catch((error) => reject(error));
    });
  }

  // Reset Forggot password
  public ForgotPassword(passwordResetEmail: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  // reset password
  public updateUserPassword(password: string, oob: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.confirmPasswordReset(oob, password)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  // Returns true when user is looged in and email is verified
  get isLogged(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }

  // Sign out
  public async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  // Get email of user
  public getUser(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.email;
  }


  /* Setting up user data */
  private updateUserData(user: any) {
    const userData = {
      last_conexion: user.metadata.lastSignInTime,
      timestamp_last_conexion: user.metadata.b
    };
    this.usersRef.update(user.uid, userData);
  }

}
