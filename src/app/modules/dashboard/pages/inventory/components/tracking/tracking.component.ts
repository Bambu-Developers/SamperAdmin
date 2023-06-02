import { Subscription } from 'rxjs';
import { ClientsService } from '../../../../../shared/services/clients.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteService } from 'src/app/modules/shared/services/route.service';
import { RouteModel } from '../../../users/models/routes.model';



@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, OnDestroy {

  public pinsArray = new Array();
  public routes: RouteModel[];
  private _subscriptionRoutes: Subscription;
  private _subscriptionClients: Subscription;


  constructor(
    private _clientsService: ClientsService,
    private routeService: RouteService,
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
    this._subscriptionClients = this._clientsService.getAllClients().subscribe(clients => {
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
    this._subscriptionRoutes = this.routeService.getAllRoutes().subscribe(
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
    if (this._subscriptionRoutes) {
      this._subscriptionRoutes.unsubscribe();
    }
    if (this._subscriptionClients) {
      this._subscriptionClients.unsubscribe();
    }
  }
}
