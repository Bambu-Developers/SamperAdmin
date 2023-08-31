import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ClientModel } from 'src/app/modules/dashboard/pages/clients/models/client.model';
import { RouteModel } from 'src/app/modules/dashboard/pages/clients/models/route.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  public NEW_NAME: any;
  private _baseClientsImagePath = 'Staging/Customer/';

  public clientRef: AngularFirestoreCollection;
  public clientDoc: AngularFirestoreDocument<ClientModel>;

  constructor(
    private _storage: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}

  // Get all products
  public getAllClients(): Observable<ClientModel[]> {
    this.clientRef = this.firestore.collection<ClientModel>('Customers');
    let clients: Observable<ClientModel[]> = this.clientRef.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c: any) => {
          const data = c.payload.doc.data() as ClientModel;
          const id = c.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return clients;
  }

  // Get product by ID
  public getClient(id: string): Observable<ClientModel> {
    return this.firestore.collection<ClientModel>('Customers').doc(id)
      .snapshotChanges()
      .pipe(
        map((ress) => {
          const data = ress.payload.data() as ClientModel;
          const clientId = ress.payload.id;
          return { id: clientId, ...data };
        })
      );
  }

  public editClient(clientData, id) {
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
      return this.firestore.collection('Customers').doc(id).update(CLIENT_DATAP).then(() => {
      }).catch((error) => {
        return error
      });
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
      return this.firestore.collection('Customers').doc(id).update(CLIENT_DATA).then(() => {
      }).catch((error) => {
        return error
      });
    }
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

  public createClient(clientData , clientArray) {
    this._setClientData(clientData);
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
    return this.firestore.collection('Customers').doc('sanper_' + clientData.phone).set(CLIENT_DATA).then((ress) => {
      this.getAllClients().subscribe(( res: any) => {
        const dataClient = {};
        res.forEach( ( element , index ) => {
          dataClient[element.id] = element;
          if ( index + 1 === res.length ) {
            localStorage.setItem( 'clients' , JSON.stringify(dataClient) );
          }
        });
      });
    }).catch((error) => {
      return error
    });
  }

  public _setClientsRouts(newRout, id): Promise <any> {
    const CLIENT_DATA: ClientModel = {
      route_id: newRout
    };
    return this.firestore.collection('Customers').doc(id).update(CLIENT_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }

  public deleteClient(id) {
    const firestore = this.firestore.collection('Customers').doc(id);
    return firestore.delete().then(() => {
    }).catch((error) => {
      return error
    });
  }

  // Probar cundo exista la tabla
  public getVisits(id: string) {
    const data = this.firestore.collection('Visits').doc(id).collection('history' , res => res.orderBy('time_stamp', 'desc'));

      const colection: Observable<any[]> = data.snapshotChanges().pipe(
        map((changes) =>
          changes.map((c: any) => {
            const data = c.payload.doc.data();
            const id = c.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  return colection;
  }


}
