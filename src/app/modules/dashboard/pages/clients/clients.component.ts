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
  public dataSource: any;

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
      }
    );
  }

  ngOnDestroy() {
    if ( this.subscriptionClients ) {
      this.subscriptionClients.unsubscribe();
    }
  }

}
