import { UserModel } from './../../users/models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { RouteModel } from '../../users/models/routes.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  public route: Observable<RouteModel>;
  public routesRef: AngularFireList<RouteModel>;
  public usersRef: AngularFireList<UserModel>;
  private _baseRoutesPath = 'Developer/Routes/';
  private _baseUsersPath = 'Users/';

  constructor(
    private _db: AngularFireDatabase,
  ) {
    this.routesRef = this._db.list<RouteModel>(this._baseRoutesPath);
    this.usersRef = this._db.list<UserModel>(this._baseUsersPath);
  }

  public createRoute(routeData) {
    const ROUTE_DATA: RouteModel = {
      id: (Math.floor(100000 + Math.random() * 9000000000)).toString(),
      name: routeData.name,
      owner: '',
      seller: ''
    };
    this.routesRef.set(ROUTE_DATA.id, ROUTE_DATA);
  }

  public getRoute(id) {
    return this.route = this._db.object<RouteModel>(`${this._baseRoutesPath}/` + id)
      .snapshotChanges()
      .pipe(
        map(res => res.payload.val())
      );
  }

  public editRoute(data, id) {
    const ROUTE_DATA: RouteModel = {
      name: data.name
    };
    this.routesRef.update(id, ROUTE_DATA);
  }

}
