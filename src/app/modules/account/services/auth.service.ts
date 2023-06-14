import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private firestore: AngularFirestore
  ) {
    this.user = afAuth.authState;
  }

  // Sign in with email/password
  public login(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password)
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
      this.afAuth.sendPasswordResetEmail(passwordResetEmail)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  }

  // reset password
  public updateUserPassword(password: string, oob: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.confirmPasswordReset(oob, password)
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
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  // Get email of user
  public getUser(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.email;
  }

  public getUserData(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.uid;
  }


  /* Setting up user data */
  private updateUserData(user: any) {
    const userData = {
      last_conexion: user.metadata.lastSignInTime,
      timestamp_last_conexion: user.metadata.b
    };
    return this.firestore.collection('Users').doc(user.uid).update(userData).then(() => {
    }).catch((error) => {
      return error
    });
  }

}
