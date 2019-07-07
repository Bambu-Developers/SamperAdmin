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
  public _basePath = 'Users/';
  private _baseRoutesPath = 'Staging/Routes/';

  constructor(
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.usersRef = this.db.list<UserModel>('Users');
    this.routesRef = this.db.list<RouteModel>(this._baseRoutesPath);
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
    const email: string = userData.email.concat('@sanper.com');
    return this.afAuth.auth.createUserWithEmailAndPassword(email, userData.password)
      .then(result => {
        this.setUserData(userData, result.user);
        this.setUserToRoute(userData, result.user);
        this.router.navigate(['/dashboard/users']);
        return true;
      }).catch((error) => {
        return error;
      });
  }

  /* Setting up user data */
  public setUserData(user, result) {
    const userData: UserModel = {
      id: result.uid,
      rol: user.rol,
      route: user.route ? user.route : 0,
      permision: user.permision,
      name: user.name,
      email: user.email,
      create_at: result.metadata.creationTime,
      timestamp_create_at: result.metadata.a,
      last_conexion: result.metadata.lastSignInTime,
      timestamp_last_conexion: result.metadata.b,
      status: 0
    };
    this.usersRef.set(userData.id, userData);
  }

  public setUserToRoute(data, uid) {
    const USER_ROUTE: RouteModel = {
      seller: uid.uid
    };
    this.routesRef.update(data.route, USER_ROUTE);
  }

  public editUserToRoute(data, uid) {
    const USER_ROUTE: RouteModel = {
      seller: uid
    };
    this.routesRef.update(data, USER_ROUTE);
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

  public editUserData(user: UserModel): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.usersRef.update(user.id, user).then(
        result => resolve(result),
        error => reject(error)
      );
    });
  }

  public getUser(idUser: string): Observable<UserModel> {
    return this.db.object('Users/' + idUser).snapshotChanges()
      .pipe(
        map(user => {
          const data = user.payload.val() as UserModel;
          const id = user.payload.key;
          return { id, ...data };
        })
      );
  }

  public getUserLogged(id): any {
    return this.db.list('Users', ref => ref.orderByChild('id').equalTo(id))
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

  public updateUserPassword(email, form): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, form.currentPassword).then(
        result => {
          const user = this.afAuth.auth.currentUser;
          user.updatePassword(form.newPassword).then(
            res => resolve(res),
            error => reject(error)
          );
        },
        error => reject(error)
      );
    });
  }

  public deleteUser(uid): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db.object(this._basePath + uid).remove().then(
        result => resolve(result),
        error => reject(error)
      );
    });
  }

  public setDisponibility(id: string, disponibility: boolean) {
    const newStatus = disponibility === true ? 0 : 1;
    const USER_DATA: UserModel = {
      status: newStatus
    };
    this.usersRef.update(id, USER_DATA);
  }

  public getRouteByID(id: string) {
    return this.db.object<RouteModel>(this._baseRoutesPath + id)
      .snapshotChanges()
      .pipe(
        map(res => res.payload.val())
      );
  }

}
