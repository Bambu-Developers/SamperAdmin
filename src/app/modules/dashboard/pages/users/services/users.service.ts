import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    public db: AngularFireDatabase,
  ) { }

  public getUsers() {
    this.db.database.ref('Users').on('value', snapshot => {
      return snapshot.val();
    });
  }
}
