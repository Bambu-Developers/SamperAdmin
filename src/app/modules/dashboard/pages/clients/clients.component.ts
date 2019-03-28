import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientsService } from 'src/app/modules/dashboard/pages/clients/services/clients.service';
import { Subscription } from 'rxjs';
import { CLIENTS_LANGUAGE } from 'src/app/modules/dashboard/pages/clients/data/language';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {

  public language = CLIENTS_LANGUAGE;
  public displayedColumns: string[] = ['bender_id', 'shop_name', 'name', 'route_id', 'isMayoreo', 'haveCredit', 'last_conexion'];
  public subscriptionClients: Subscription;
  public subscriptionRoutes: Subscription;
  public dataSource: any;
  public dataRoutes: any;
  public google: any;

  constructor(
    private clientsService: ClientsService,
  ) { }

  ngOnInit() {
    this.getClients();
  }

  public getClients() {
    this.subscriptionClients = this.clientsService.getAllClients().subscribe(
      res => {
        this.dataSource = res;
        this.dataSource.forEach(customer => {
          this.clientsService.getRouteByID(customer.route_id).subscribe(route => {
            customer.route_name = route.name;
          });
        });
      }
    );
  }

  ngOnDestroy() {
    if ( this.subscriptionClients ) {
      this.subscriptionClients.unsubscribe();
    }
    if ( this.subscriptionRoutes ) {
      this.subscriptionRoutes.unsubscribe();
    }
  }

}
