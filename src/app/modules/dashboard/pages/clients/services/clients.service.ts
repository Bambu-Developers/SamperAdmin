import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { ClientModel } from 'src/app/modules/dashboard/pages/clients/models/client.model';
import { RouteModel } from 'src/app/modules/dashboard/pages/clients/models/route.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  public client: Observable<ClientModel>;
  public clientsRef: AngularFireList<ClientModel>;
  public routesRef: AngularFireList<RouteModel>;
  public analytic: AngularFireList<any>;
  public NEW_NAME: any;
  private _baseClientsPath = 'Staging/Customers/';
  private _baseClientsImagePath = 'Staging/Customer/';
  private _baseRoutesPath = 'Staging/Routes/';

  constructor(
    private db: AngularFireDatabase,
    private _storage: AngularFireStorage,
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
    return this.db.object<RouteModel>(`${this._baseRoutesPath}/` + id)
      .snapshotChanges()
      .pipe(
        map(res => res.payload.val())
      );
  }

  // Get product by ID
  public getClient(id: string) {
    console.log(`${this._baseClientsPath}` + id);
    // return this.db.list<ClientModel>('Staging/Customers/sanper_4386969652' ).valueChanges();


    return this.client = this.db.object<ClientModel>(`${this._baseClientsPath}` + id)
      .snapshotChanges()
      .pipe(
        map( ress => {
          console.log(ress);
          return ress.payload.val();
        })
    );
  }

  public createClient(clientData , clientArray) {
    this._setClientData(clientData);
    this._setClientAnalytics(clientArray);
  }

  public editClient(clientData, id) {
    this._setEditedClientData(clientData, id);
  }

  public imageUpload(image: any) {
    image = 'data:image/jpeg;base64,' + image;
    return new Promise<any>((resolve, reject) => {
      this.NEW_NAME = `${new Date().getTime()}`;
      const PATH = `${this._baseClientsImagePath}/${this.NEW_NAME}`;
      this._storage.ref(PATH).putString(image, 'data_url').then(
        response => resolve(
          this._storage.ref(PATH).getDownloadURL()
        ),
        (error: any) => {
        });
    });
  }

  // TODO: Implementing edit credit functionality
  public editCredit(creditData, id) {
    // this._setEditedClientCredit( creditData, id );
  }

  // TODO: Implementing assign credit functionality
  public assignCredit(creditData, id) {
    this._setClientCredit(creditData, id);
  }

  // TODO: Setting credit data to the client
  private _setEditedClientCredit(creditData, id) {
  }

  private _setClientData(clientData) {
    const create =  JSON.parse(localStorage.getItem('user'));
    const CLIENT_DATA: ClientModel = {
      bender_id: (Math.floor(100000 + Math.random() * 9000000000000)).toString(),
      id: 'sanper_' + clientData.phone,
      photo: clientData.photo,
      name: clientData.name,
      shop_name: clientData.shop_name,
      phone: clientData.phone,
      route_id: clientData.route,
      monday: clientData.monday,
      tuesday: clientData.tuesday,
      wednesday: clientData.wednesday,
      thursday: clientData.thursday,
      friday: clientData.friday,
      saturday: clientData.saturday,
      sunday: clientData.sunday,
      haveCredit: false,
      create_at: new Date().toString(),
      email: clientData.email,
    };
    this.clientsRef.set('sanper_' + clientData.phone, CLIENT_DATA);
  }

  public _getlistClientAnalyticsKey() {
    // this.db.object('Analytic/Clients/2022').remove();
    return  this.db.list<any>('Analytic/Clients/').snapshotChanges()
    .pipe(
      map( (res: any) => {
        return res;
      })
    );
  }

  public _getlistClientAnalytics(id) {
    return this.db.list<any>('Analytic/Clients/' +  id , res  => res ).valueChanges();
  }

  public _setClientAnalytics( clientDate ) {
    const dataAux = new Date();
    if ( clientDate === null ) {
      clientDate = [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0, 0 , 0, 0 , 0 ];
      clientDate[dataAux.getMonth()] = clientDate[dataAux.getMonth()] + 1;
      this.db.list<any>('Analytic/Clients/').set( `${ dataAux.getFullYear() }` ,
        {
          month: [ 'Enero', 'Febrero', 'Marzo' , 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
          clients: clientDate
        });
    } else {
      clientDate[dataAux.getMonth()] = clientDate[dataAux.getMonth()] + 1;
      this.db.list<any>('Analytic/Clients/').update( `${ dataAux.getFullYear() }` ,
        {
          month: [ 'Enero', 'Febrero', 'Marzo' , 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
          clients: clientDate
        });
    }
  }

  private _setEditedClientData(clientData, id) {
    const monday = clientData.monday === undefined ? false : clientData.monday;
    const tuesday = clientData.tuesday === undefined ? false : clientData.tuesday;
    const wednesday = clientData.wednesday === undefined ? false : clientData.wednesday;
    const thursday = clientData.thursday === undefined ? false : clientData.thursday;
    const friday = clientData.friday === undefined ? false : clientData.friday;
    const saturday = clientData.saturday === undefined ? false : clientData.saturday;
    const sunday = clientData.sunday === undefined ? false : clientData.sunday;
    const haveCredit = clientData.haveCredit = clientData.haveCredit;
    if (clientData.photo === undefined) {
      const CLIENT_DATAP: ClientModel = {
        photo: '',
        name: clientData.name,
        shop_name: clientData.shop_name,
        phone: clientData.phone,
        route_id: clientData.route,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday,
        haveCredit : haveCredit
      };
      this.clientsRef.update(id, CLIENT_DATAP);
    } else {
      const CLIENT_DATA: ClientModel = {
        photo: clientData.photo,
        name: clientData.name,
        shop_name: clientData.shop_name,
        phone: clientData.phone,
        route_id: clientData.route,
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thursday: thursday,
        friday: friday,
        saturday: saturday,
        sunday: sunday,
        haveCredit : haveCredit
      };
      this.clientsRef.update(id, CLIENT_DATA);
    }
  }

  private _setClientCredit(creditData, id) {
    const CLIENT_DATA: ClientModel = {
      haveCredit: true
    };
    this.clientsRef.update(id, CLIENT_DATA);
  }

  public deleteClient(id) {
    this.db.object(`${this._baseClientsPath}/` + id).remove();
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
