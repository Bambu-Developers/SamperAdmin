import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  public inventoryRef: AngularFireList<any>;
  public devolutionsRef: AngularFireList<any>;
  public liquidationRef: AngularFireList<any>;
  public lossRef: AngularFireList<any>;
  public histroyRef: AngularFireList<any>;
  public hisInvRef: AngularFireList<any>;
  private _basePathInv = 'Staging/Inventory/';
  private _basePathDev = 'Staging/Devolutions/';
  private _basePathLoss = 'Staging/LostProduct/';
  private _basePathLiq = 'Staging/Liquidations/';
  private _basePathHis = 'Staging/HistoryRoutes/';
  private _basePathInvHis = 'Staging/HistoryInventory/';
  private _basePathRouteStorer = 'Staging/HistoryRoutesStorer/';

  constructor(
    private http: HttpClient,
    private _db: AngularFireDatabase,
  ) {
    this.inventoryRef = this._db.list<any>(this._basePathInv);
    this.devolutionsRef = this._db.list<any>(this._basePathDev);
    this.histroyRef = this._db.list<any>(this._basePathHis);
    this.hisInvRef = this._db.list<any>(this._basePathInvHis);
  }

  public getInventories() {
    const inventories = this.inventoryRef;
    return inventories;
  }

  public getLimitedSales() {
    const startDate = moment('20191220', 'YYYYMMDD').toDate().getTime();
    return this._db.list(this._basePathHis, ref => ref.orderByChild('timesatamp').startAt(1577978773055));
  }

  public getSalesToDelete(route) {
    return this._db.list(this._basePathHis + route);
  }

  public deleteTicket(route, idTicket) {
    return this._db.list(this._basePathHis + route + '/').remove(idTicket);
  }

  public getDevolutionsL(): Observable<any[]> {
    return this.devolutionsRef
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => {
            const data = c.payload.val();
            const id = c.payload.key;
            return { id, ...data };
          })
        )
      );
  }

  public getDevolutions( date , user ): Promise<any> {
    return this.http.get(`${environment.urlService}/devolutions?date=${date}&route=${user}`, { }).toPromise();
  }

  public getLosses( date , route ): Promise<any> {
    return this.http.get(`${environment.urlService}/lostProducts?date=${date}&route=${route}`, { }).toPromise();
  }

  public approveLiquidation(userId, userName, date, userRoute, totalSale, totalLiquidation, totalWithLoss, totalDevolutions, totalLosses) {
    this.liquidationRef = this._db.list<any>(`${this._basePathLiq + userRoute}`);
    const LIQUIDATION_DATA = {
      uid: userId,
      user_name: userName,
      date: date,
      route: userRoute,
      total_sale: totalSale,
      total_liquidation: totalLiquidation,
      total_liq_loss: totalWithLoss,
      total_devolutions: totalDevolutions,
      total_losses: totalLosses,
    };
    this.liquidationRef.push(LIQUIDATION_DATA);
  }

  public getLiquidation(id: string , dataStart , dataEnd): Promise<any> {
    try {
      return this.http.get(`${environment.urlService}/liquidations?dateStart=${dataStart}&dateEnd=${dataEnd}&route=${id}`, { }).toPromise();
    } catch (error) {
      throw error;
    }

  }

  public getLiquidationAux( id: string ) {
    return this._db.list<any>('Staging/Liquidations/' + id).valueChanges();
  }


  public getLiquidationsFromKeys(key) {
    const rest = this._db.list(this._basePathLiq + key );
    return rest;
  }

  public getSales(id: string , dataStart , dataEnd ): Promise<any> {

    return this.http.get(`${environment.urlService}/shopping?dateStart=${dataStart}&dateEnd=${dataEnd}&route=${id}`, { }).toPromise();


      // return this._db.list<any>( 'Staging/HistoryRoutes/' + id , res => res.orderByChild('date').startAt(dataStart).endAt(dataEnd)
      // ).valueChanges();
  }

  public getSalesFromKeys(key) {
    const rest = this._db.list(this._basePathHis + key);
    return rest;
  }

  public getSaleByTicket(route, ticket): Promise<any> {
    return this.http.get(`${environment.urlService}/shopping/ticket?route=${route}&ticket=${ticket}`, { }).toPromise();
    // return this._db.list('Staging/HistoryRoutes' + '/' + route + '/' + ticket  ).valueChanges();
  }

  public getProductsSold(key, id) {
    const rest = this._db.list(this._basePathHis + key + '/' + id + '/Products');
    return rest;
  }

  public getSalesByDate(key, startDate: Date, endDate: Date) {
    endDate = moment(endDate).add(1, 'day').toDate();
    return this._db.list(`${this._basePathHis + key}`,
      ref => ref.orderByChild('timesatamp').startAt(startDate.getTime()).endAt(endDate.getTime())
    );
  }

  public getSalesByDateLiq(key, startDate: Date, endDate: Date) {
    endDate = moment(endDate).add(1, 'day').toDate();
    return this._db.list(`${this._basePathRouteStorer + key}`,
      ref => ref.orderByChild('timesatamp').startAt(startDate.getTime()).endAt(endDate.getTime())
    );
  }

  public getSalesByKey(key) {
    return this._db.list(`${this._basePathHis + key}`);
  }

  public getLossesByDate(key, startDate: Date, endDate: Date) {
    endDate = moment(endDate).add(1, 'day').toDate();
    return this._db.list(`${this._basePathLoss + key}`,
      ref => ref.orderByChild('timestamp').startAt(startDate.getTime()).endAt(endDate.getTime())
    );
  }

}
