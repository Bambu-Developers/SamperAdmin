import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserModel } from '../../dashboard/pages/users/models/user.model';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RouteService } from './route.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public usersRef: AngularFirestoreCollection<UserModel>;
  public userDoc: AngularFirestoreDocument<UserModel>;

  constructor(
    private firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public routeService: RouteService,
    private router: Router,
  ) { }

    // Get all users
    public getAllUsers(): Observable<UserModel[]> {
      this.usersRef = this.firestore.collection<UserModel>('Users');
      let users: Observable<UserModel[]>;
      users = this.usersRef.snapshotChanges().pipe(
        map((changes) =>
          changes.map((c) => {
            const data = c.payload.doc.data() as UserModel;
            const id = c.payload.doc.id;
            return { id, ...data };
          })
        )
      );
      return users;
    }

    public getUser(id: string): Observable<UserModel> {
      this.userDoc = this.firestore.collection('Users').doc(id);
      return this.userDoc.snapshotChanges().pipe(
        map((res) => {
          const data = res.payload.data() as UserModel;
          const userId = res.payload.id;
          return { id: userId, ...data };
        })
      );
    }

    public getUserLogged(id: string): any {
      return this.firestore.collection('Users', ref => ref.where('id', '==', id))
        .snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => {
              const data = c.payload.doc.data() as UserModel;
              const docId = c.payload.doc.id;
              return { id: docId, ...data };
            })
          )
        );
    }

  public editUserData(user: UserModel) {
    return this.firestore.collection('Users').doc(user.id).update(user).then(() => {
    }).catch((error) => {
      return error
    });
  }

   public async deleteUser(uid): Promise<any> {
    await this.firestore.collection('Users').doc(uid).delete().then( async(resssss) => {
      await this.deleteUserAccount(uid).then( (ress)=> {
        return ress;
      }).catch((error) => {
      return error
      })
    }).catch((error) => {
      return error
    });
  }

  public async deleteUserAccount(uid: string): Promise<any> {
    try {
      const user = await this.afAuth.authState.pipe(first()).toPromise();
      if (user) {
        if (user.uid === uid) {
          await user.delete();
        } else {
          throw new Error('El UID del usuario no coincide');
        }
      } else {
        throw new Error('Usuario no autenticado');
      }
    } catch (error) {
      throw error;
    }
  }

  public setDisponibility(id: string, disponibility: boolean) {
    const newStatus = disponibility === true ? 0 : 1;
    const USER_DATA: UserModel = {
      status: newStatus
    };
    return this.firestore.collection('Users').doc(id).update(USER_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }

  public async createUser(userData): Promise<any> {
    const email: string = userData.email.concat('@sanper.com');
    const promiseAux = await this.afAuth.createUserWithEmailAndPassword(email, userData.password).then((result: any) => {
        this.setUserData(userData, result.user);
        this.routeService.editUserToRoute(userData, result.user);
    }).catch((error) => {
        return error;
    });
    return promiseAux;
  }

  public setUserData(user, result) {
    const userData: UserModel = {
      id: result.uid,
      rol: user.rol,
      permision: {
        create_edit_promotions: user.permision.create_edit_promotions,
        price_edition: user.permision.price_edition,
        user_registration: user.permision.user_registration
      },
      name: user.name,
      email: user.email,
      create_at: result.metadata.creationTime,
      timestamp_create_at: result.metadata.a,
      last_conexion: result.metadata.lastSignInTime,
      timestamp_last_conexion: result.metadata.b,
      route: user.route ? user.route : 0,
      status: 0
    };
    user.route ? userData.route = user.route : null;
    return this.firestore.collection('Users').doc(result.uid).set(userData).then((ress) => {
    }).catch((error) => {
      return error
    });
  }

  public updateUserPassword(email, form): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, form.currentPassword).then(
        async result => {
          const user = this.afAuth.currentUser;
          (await user).updatePassword(form.newPassword).then(
            res => resolve(res),
            error => reject(error)
          );
        },
        error => reject(error)
      );
    });
  }

  public getAllUsersByRoute(routeId: string): Observable<UserModel[]> {
  this.usersRef = this.firestore.collection<UserModel>('Users', ref => ref.where('route', '==', routeId));
  let users: Observable<UserModel[]>;
  users = this.usersRef.snapshotChanges().pipe(
    map((changes) =>
      changes.map((c) => {
        const data = c.payload.doc.data() as UserModel;
        const id = c.payload.doc.id;
        return { id, ...data };
      })
    )
  );
  return users;
}

}
