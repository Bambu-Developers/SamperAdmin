import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteModel } from '../../dashboard/pages/users/models/routes.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  public routesRefDoc: AngularFirestoreDocument<RouteModel>;
  public routesRef: AngularFirestoreCollection<RouteModel>;
  public route: Observable<RouteModel>;
  constructor(
    private firestore: AngularFirestore,
  ) {}

  public getRouteByID(id: string): Observable<RouteModel> {
    this.routesRefDoc = this.firestore.collection<RouteModel>('Routes').doc(id);
    let products: Observable<RouteModel>;
    products = this.routesRefDoc.snapshotChanges().pipe(
      map((res) => {
        const data = res.payload.data() as RouteModel;
        const productId = res.payload.id;
        return { id: productId, ...data };
      })
    );
    return products;
  }
   public getAllRoutes(): Observable<RouteModel[]> {
    this.routesRef = this.firestore.collection<RouteModel>('Routes');
    let products: Observable<RouteModel[]>;
    products = this.routesRef.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => {
          const data = c.payload.doc.data() as RouteModel;
          const id = c.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return products;
  }

  public editUserToRoute(route: any, uid: string) {
    const USER_ROUTE: RouteModel = {
      seller: uid
    };
    return this.firestore.collection('Routes').doc(route).update(USER_ROUTE).then(() => {
    }).catch((error) => {
      return error
    });
  }

  public createRoute(routeData) {
    const ROUTE_DATA: RouteModel = {
      id: (Math.floor(100000 + Math.random() * 9000000000)).toString(),
      name: routeData.name,
      owner: '',
      seller: ''
    };
    this.getRouteByID(ROUTE_DATA.id).subscribe(res => {
      if(res.name !== null && res.name !== undefined ) {
      }else {
        return this.firestore.collection('Routes').doc(ROUTE_DATA.id).set(ROUTE_DATA).then((ress) => {
        }).catch((error) => {
          return error
        });
      }
    })
  }

  public editRoute(data, id) {
    const ROUTE_DATA: RouteModel = {
      name: data.name
    };
    return this.firestore.collection('Routes').doc(id).update(ROUTE_DATA).then(() => {
    }).catch((error) => {
      return error
    });
  }
}
