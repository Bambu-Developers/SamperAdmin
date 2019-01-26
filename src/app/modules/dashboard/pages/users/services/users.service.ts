import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  public usersRef: AngularFireList<UserModel>;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
  ) {
    this.usersRef = this.db.list<UserModel>('Users');
  }

  public getAllUsers(): Observable<UserModel[]> {
    return this.usersRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => {
            const data = c.payload.val() as UserModel;
            const id = c.payload.key;
            return { id, ...data };
          })
        )
      );
  }

  // Create user
  public createUser(userData) {
    return this.afAuth.auth.createUserWithEmailAndPassword(userData.email, userData.password)
      .then((result: any) => {
        this.setUserData(userData, result.user);
      }).catch((error) => {
        return error;
      });
  }

  /* Setting up user data */
  public setUserData(user, result) {
    const userData: UserModel = {
      rol: user.rol,
      route: user.route ? user.route : 0,
      permision: user.permision ? user.permision : [],
      name: user.name,
      email: user.email,
      create_at: result.metadata.creationTime,
      last_conexion: result.metadata.lastSignInTime,
      status: user.status ? user.status : 0
    };
    this.usersRef.push(userData);
  }
}
