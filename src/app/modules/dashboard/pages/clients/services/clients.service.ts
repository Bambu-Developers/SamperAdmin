import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ClientModel } from 'src/app/modules/dashboard/pages/clients/models/client.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  public clientsRef: AngularFireList<ClientModel>;
  public client: Observable<ClientModel>;
  private _basePath = 'Developer/Customers/';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private router: Router,
  ) {
    this.clientsRef = this.db.list<ClientModel>(this._basePath);
  }

  // Get all products
  public getAllClients(): Observable<ClientModel[]> {
    return this.clientsRef
    .snapshotChanges()
    .pipe(
      map(changes =>
        changes.map(c => {
          const data = c.payload.val() as ClientModel;
          const id = c.payload.key;
          return { id, ...data };
        })
      )
    );
  }

  // Get product by ID
  public getProduct(id: string): Observable<ClientModel> {
    return this.client = this.db.object<ClientModel>(`${this._basePath}/` + id )
    .snapshotChanges()
    .pipe(
      map(res => res.payload.val())
    );
  }
}
