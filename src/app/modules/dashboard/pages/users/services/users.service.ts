import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RouteModel } from '../models/routes.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  public usersRef: AngularFireList<UserModel>;
  public routesRef: AngularFireList<RouteModel>;

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.usersRef = this.db.list<UserModel>('Users');
    this.routesRef = this.db.list<RouteModel>('Developer/Routes');
  }

  // Get all users
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
        this.router.navigate(['/dashboard/users']);
        return true;
      }).catch((error) => {
        return error;
      });
  }

  /* Setting up user data */
  public setUserData(user, result) {
    const userData: UserModel = {
      rol: user.rol,
      route: user.route ? user.route : 0,
      permision: user.permision,
      name: user.name,
      email: user.email,
      create_at: result.metadata.creationTime,
      timestamp_create_at: result.metadata.a,
      last_conexion: result.metadata.lastSignInTime,
      timestamp_last_conexion: result.metadata.b,
      status: user.status ? user.status : 0
    };
    this.usersRef.push(userData);
  }

  // Get all router
  public getAllRoutes(): Observable<RouteModel[]> {
    return this.routesRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => {
            const data = c.payload.val() as RouteModel;
            const id = c.payload.key;
            return { id, ...data };
          })
        )
      );
  }
}
