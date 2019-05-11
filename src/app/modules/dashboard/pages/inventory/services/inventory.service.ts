import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  public inventoryRef: AngularFireList<any>;
  public inventory: Observable<any>;
  private _basePath = 'Developer/Inventory/';

  constructor(
    private _db: AngularFireDatabase,
    private _storage: AngularFireStorage,
  ) {
    this.inventoryRef = this._db.list<any>(this._basePath);
  }

  public getInventories() {
    const inventories = this.inventoryRef;
    return inventories;
  }

  public getInventoriesFromKeys(key) {
    const rest = this._db.list(this._basePath + key);
    return rest;
}
}
