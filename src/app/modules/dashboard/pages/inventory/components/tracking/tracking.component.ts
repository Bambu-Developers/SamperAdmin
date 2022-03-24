import { Subscription } from 'rxjs';
import { ClientsService } from './../../../clients/services/clients.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteModel } from '../../../clients/models/route.model';



@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, OnDestroy {

  public pinsArray = new Array();
  public routes: RouteModel[];
  // public latitude = 19.305454343725557;
  // public longitude = -99.16890953528679;
  public latitude = 20.348254;
  public longitude = -102.030706;
  // private _subscriptionRoutes: Subscription;
  // private _subscriptionClients: Subscription;


  constructor(
    private _clientsService: ClientsService,
  ) { }

  ngOnInit() {

    this.getRoutes();
    this.getPinsByRoute('');
    this.getAllPins();
  }

  public getPinsByRoute(route) {
    this.pinsArray = [];
    let array = <any>[];
    this._clientsService.getAllClients().subscribe(clients => {
      clients.forEach(client => {
        if (client.route_id === route) {
          array = {
            id: client.route_id,
            lat: client.latitud,
            lng: client.longitud,
            shop_name: client.shop_name,
            owner_name: client.name,
            phone: client.phone,
          };
          this.pinsArray.push(array);
        }
      });
    });
  }

  public getAllPins() {
    this.pinsArray = [];
    let array = <any>[];
    this._clientsService.getAllClients().subscribe(clients => {
      clients.forEach(client => {
        array = {
          id: client.route_id,
          lat: client.latitud,
          lng: client.longitud,
          shop_name: client.shop_name,
          owner_name: client.name,
          phone: client.phone,
        };
        this.pinsArray.push(array);
      });
    });
  }

  public getRoutes() {
    this._clientsService.getAllRoutes().subscribe(
      res => {
        this.routes = res.sort((r1, r2) => {
          if (r1.name < r2.name) {
            return -1;
          }
          if (r1.name > r2.name) {
            return 1;
          }
          return 0;
        });
      });
  }

  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
  }

  onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
  }

  public ngOnDestroy() {
    // if (this._subscriptionRoutes) {
    //   this._subscriptionRoutes.unsubscribe();
    // }
    // if (this._subscriptionClients) {
    //   this._subscriptionClients.unsubscribe();
    // }
  }
}
