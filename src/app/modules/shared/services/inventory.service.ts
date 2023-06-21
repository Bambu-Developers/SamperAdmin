import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientModel } from '../../dashboard/pages/clients/models/client.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  public clientRef: AngularFirestoreCollection<ClientModel>;

  constructor(
    private firestore: AngularFirestore
  ) {}


  public getLosses( date , route ): Observable<any> {
    const data = this.firestore.collection<ClientModel>('LostProduct').doc(route) .collection(`Products`, ref =>
      ref.where('date', '>=', date).where('date', '<=', date).orderBy('date', 'desc')
    );
    let losses: Observable<any[]> = data.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c: any) => {
          const data = c.payload.doc.data();
          const id = c.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return losses;
  }

  public getLossesByDate(key, startDate: Date, endDate: Date) {
    const data = this.firestore.collection<ClientModel>('LostProduct').doc(key) .collection(`Products`, ref =>
      ref.where('date', '>=', startDate).where('date', '<=', endDate).orderBy('date', 'desc')
    );
    let losses: Observable<any[]> = data.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c: any) => {
          const data = c.payload.doc.data();
          const id = c.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return losses;
  }

  public approveLiquidation(userId, userName, date, userRoute, totalSale, totalLiquidation, totalWithLoss, totalDevolutions, totalLosses,
    totalCredit, collection, cash, difference ) {
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
      totalCredit: totalCredit,
      collection: collection,
      cash: cash,
      difference: difference
    };
    return this.firestore.collection('Liquidations').doc(userRoute).collection(userRoute).add(LIQUIDATION_DATA).then((ress) => {
     }).catch((error) => {
      return error
    });
  }

  public getLiquidationToDate(idRoute: string, startDate: Date, endDate: Date): Observable<any[]> {
    this.clientRef = this.firestore.collection<ClientModel>('Liquidations').doc('RouteList').collection(`${idRoute}`, ref =>
      ref.where('date', '>=', startDate).where('date', '<=', endDate).orderBy('date', 'desc')
    );
    let liquidations: Observable<any[]> = this.clientRef.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c: any) => {
          const data = c.payload.doc.data();
          const id = c.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return liquidations;
  }

  public getLiquidationToId(idRoute: string , idLiquidation: string): Observable<any[]> {
    const refAux = this.firestore.collection<ClientModel>('Liquidations').doc('RouteList').collection(`${idRoute}`).doc(idLiquidation);
    let liquidation: Observable<any[]> = refAux.snapshotChanges().pipe(
        map((c: any) => {
          const data = c.payload.data();
          const id = c.payload.id;
          return { id, ...data };
        })
    );
    return liquidation;
  }


  public getSales(idRoute: string , dataStart , dataEnd ): Observable<any> {
    dataEnd = moment(dataEnd).add(1, 'day').format('YYYY-MM-DD');
    const ref = this.firestore.collection<ClientModel>('HistoryRoutes').doc(idRoute).collection( 'Orders' ,
      ref =>  ref.where('date', '>=', dataStart).where('date', '<=', dataEnd).orderBy('date', 'desc')
    );

    const colection: Observable<any[]> = ref.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c: any) => {
          const data = c.payload.doc.data();
          const id = c.payload.doc.id;
          const route_id = idRoute;
          return { id, route_id , ...data };
        })
      )
    );
    return colection;
  }


  public getSalesToDay(idRoute: string, date: Date): Observable<any> {
    let startOfDay: any = new Date(date);
    let endOfDay: any = new Date(date);
    startOfDay = moment(endOfDay).add(1, 'day').format('YYYY-MM-DD');
    endOfDay = moment(endOfDay).add(2, 'day').format('YYYY-MM-DD');
    const ref = this.firestore.collection<ClientModel>('HistoryRoutes').doc(idRoute).collection('Orders',
      ref => ref.where('date', '>=', startOfDay).where('date', '<=', endOfDay).orderBy('date', 'desc')
    );
    const collection: Observable<any[]> = ref.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c: any) => {
          const data = c.payload.doc.data();
          const id = c.payload.doc.id;
          const route_id = idRoute;
          return { id, route_id , ...data };
        })
      )
    );
    return collection;
  }


  public getSaleByTicket(route, ticket): Observable<any> {
    const ref = this.firestore.collection('HistoryRoutes').doc(route).collection( 'Orders').doc(ticket);

    return ref.snapshotChanges().pipe(
      map((changes: any) => {
        const data = changes.payload.data();
        const id = changes.payload.id;
        const route_id = route;
        return { id, route_id , ...data };
      }));
  }

}
