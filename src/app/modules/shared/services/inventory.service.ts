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
    let startOfDay: any = new Date(date).getTime();
    let endOfDay: any = new Date(date).getTime() + (24 * 60 * 60 * 1000);
    console.log(startOfDay + (6 * 60 * 60 * 1000 ) ,  endOfDay + (6 * 60 * 60 * 1000 ));
    const data = this.firestore.collection<ClientModel>('LostProduct').doc(route) .collection(`Products`, ref =>
      ref.where('timestamp', '>=', startOfDay + (6 * 60 * 60 * 1000 ) ).where('timestamp', '<=', endOfDay + (6 * 60 * 60 * 1000 )  ).orderBy('timestamp', 'desc')
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

  public getLossesCommission(key, startDate: Date, endDate: Date) {
    let startOfDay: any = new Date(startDate).getTime();
    let endOfDay: any = new Date(endDate).getTime();
    const data = this.firestore.collection<ClientModel>('LostProduct').doc(key) .collection(`Products`, ref =>
      ref.where('timestamp', '>=', startOfDay + (6 * 60 * 60 * 1000 )  ).where('timestamp', '<=', endOfDay + (86399000 + (6 * 60 * 60 * 1000 ) )).orderBy('timestamp', 'desc')
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
    console.log(losses );
    return losses;
  }

  public getLossesByDate(key, startDate: Date, endDate: Date) {
    let startOfDay: any = new Date(startDate).getTime();
    let endOfDay: any = new Date(endDate).getTime();
    const data = this.firestore.collection<ClientModel>('LostProduct').doc(key) .collection(`Products`, ref =>
      ref.where('timestamp', '>=', startOfDay + (6 * 60 * 60 * 1000 ) ).where('timestamp', '<=', endOfDay + (6 * 60 * 60 * 1000 ) ).orderBy('timestamp', 'desc')
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
    console.log(losses );
    return losses;
  }

  public approveLiquidation(userId, userName, date, userRoute, totalSale, totalLiquidation, totalWithLoss, totalDevolutions, totalLosses,
    totalCredit, collection, cash, difference ) {
    let startOfDay: any = new Date(date).getTime();
    const LIQUIDATION_DATA = {
      uid: userId,
      user_name: userName,
      date: date,
      timestamp: startOfDay,
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
    let startOfDay: any = new Date(startDate).getTime();
    let endOfDay: any = new Date(endDate).getTime();
    this.clientRef = this.firestore.collection<ClientModel>('Liquidations').doc(idRoute).collection(`${idRoute}`,
     ref =>
      ref.where('timestamp', '>=', startOfDay).where('timestamp', '<=', endOfDay).orderBy('timestamp', 'desc')
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
    const refAux = this.firestore.collection<ClientModel>('Liquidations').doc(idRoute).collection(`${idRoute}`).doc(idLiquidation);
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
    let startOfDay: any = new Date(dataStart).getTime();
    let endOfDay: any = new Date(dataEnd).getTime() + (24 * 60 * 60 * 1000);

    const ref = this.firestore.collection<ClientModel>('HistoryRoutes').doc(idRoute).collection( 'Orders' ,
      ref =>  ref.where('date_time', '>=', startOfDay).where('date_time', '<=', endOfDay).orderBy('date_time', 'desc')
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

    let startOfDay: any = new Date(date).getTime();
    let endOfDay: any = new Date(date).getTime() + (24 * 60 * 60 * 1000);
    const ref = this.firestore.collection<ClientModel>('HistoryRoutes').doc(idRoute).collection('Orders',
      ref => ref.where('date_time', '>=', startOfDay).where('date_time', '<=', endOfDay).orderBy('date_time', 'desc')
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
