import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  usersRef: AngularFireList<any>;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      this.usersRef = this.db.list('Users');
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  // Sign in with email/password
  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.router.navigate(['/dashboard']);
        this.updateUserData(result.user);
      }).catch((error) => {
        return error;
      });
  }

  // Reset Forggot password
  async ForgotPassword(passwordResetEmail: string) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
      return { send: true };
    } catch (e) {
      return e;
    }
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
  public getUser() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.email;
  }

  // reset password
  public updateUserPassword(password: string, oob: string) { }

  /* Setting up user data */
  public updateUserData(user: any) {
    const userData: User = {
      email: user.email,
      create_at: user.metadata.creationTime,
      last_conexion: user.metadata.lastSignInTime,
      id: user.uid,
    };
    this.usersRef.update(user, userData);
  }

}
