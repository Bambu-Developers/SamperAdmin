import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

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

  constructor(
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

  public getDevolutions() {
    return this.devolutionsRef = this._db.list<any>(this._basePathDev);
  }

  public getLosses() {
    return this.lossRef = this._db.list<any>(this._basePathLoss);
  }

  public getLossesFromKeys(key) {
    const rest = this._db.list(this._basePathLoss + key);
    return rest;
  }

  public getInventoriesFromKeys(key) {
    const rest = this._db.list(this._basePathInv + key);
    return rest;
  }

  public approveLiquidation(userId, date, userRoute, totalSale, totalLiquidation, totalWithLoss, totalDevolutions, totalLosses) {
    this.liquidationRef = this._db.list<any>(`${this._basePathLiq + userRoute}`);
    const LIQUIDATION_DATA = {
      uid: userId,
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

  public getLiquidation() {
    return this.liquidationRef = this._db.list<any>(this._basePathLiq);
  }

  public getLiquidationsFromKeys(key) {
    const rest = this._db.list(this._basePathLiq + key);
    return rest;
  }

  public getSales() {
    const sales = this.histroyRef;
    return sales;
  }

  public getSalesFromKeys(key) {
    const rest = this._db.list(this._basePathHis + key);
    return rest;
  }

  public getSaleByTicket(route, ticket) {
    return this._db.list(`${this._basePathHis}/${route}/${ticket}`);
  }
  public getInvHis() {
    const inventories = this.hisInvRef;
    return inventories;
  }

  public getInvHisFromKeys(key) {
    const rest = this._db.list(this._basePathInvHis + key);
    return rest;
  }

  public getProductsSold(key, id) {
    const rest = this._db.list(this._basePathHis + key + '/' + id + '/Products');
    return rest;
  }

  public getSalesByDate(key, startDate:Date, endDate: Date) {
    endDate = moment(endDate).add(1,"day").toDate()
/*     startDate =
    endDate = parseInt(endDate, 10); */
    return this._db.list(`${this._basePathHis + key}`,
      ref => ref.orderByChild('timesatamp').startAt(startDate.getTime()).endAt(endDate.getTime())
    );
  }

  public getLossesByDate(key, startDate :Date, endDate: Date) {
    endDate = moment(endDate).add(1,"day").toDate()
    return this._db.list(`${this._basePathLoss + key}`,
      ref => ref.orderByChild('timestamp').startAt(startDate.getTime()).endAt(endDate.getTime())
    );
  }

}
