import { CLIENTS_LANGUAGE } from './../data/language';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ClientModel } from 'src/app/modules/dashboard/pages/clients/models/client.model';
import { RouteModel } from 'src/app/modules/dashboard/pages/clients/models/route.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  public client: Observable<ClientModel>;
  public clientsRef: AngularFireList<ClientModel>;
  public routesRef: AngularFireList<RouteModel>;
  private _baseClientsPath = 'Developer/Customers/';
  private _baseRoutesPath = 'Developer/Routes/';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private router: Router,
  ) {
    this.clientsRef = this.db.list<ClientModel>(this._baseClientsPath);
    this.routesRef = this.db.list<RouteModel>(this._baseRoutesPath);
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

  public getRouteByID(id: string) {
    return this.db.object<RouteModel>(`${this._baseRoutesPath}/` + id )
    .snapshotChanges()
    .pipe(
      map(res => res.payload.val())
    );
  }

  // Get product by ID
  public getClient(id: string): Observable<ClientModel> {
    return this.client = this.db.object<ClientModel>(`${this._baseClientsPath}/` + id )
    .snapshotChanges()
    .pipe(
      map(res => res.payload.val())
    );
  }

  public editCredit( creditData, id ) {
    // this._setEditedClientCredit( creditData, id );
    this.router.navigate(['/dashboard/clients/view/' +  id]);
  }

  public assignCredit( creditData, id ) {
    this._setClientCredit( creditData, id );
    this.router.navigate(['/dashboard/clients/view/' +  id]);
  }

  private _setEditedClientCredit( creditData, id ) {
  }

  private _setClientCredit( creditData, id ) {
    const CLIENT_DATA: ClientModel = {
      haveCredit: true
    };
    this.clientsRef.update( id, CLIENT_DATA);
  }
}
