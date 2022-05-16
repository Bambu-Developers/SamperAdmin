import { Component, OnInit, OnDestroy , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ClientsService } from '../services/clients.service';

@Component({
  selector: 'app-change-rout',
  templateUrl: './change-rout.component.html',
  styleUrls: ['./change-rout.component.scss']
})
export class ChangeRoutComponent implements OnInit {

  public routeAux = '';
  public contAux = -1;

  constructor(
    public dialogRef: MatDialogRef<ChangeRoutComponent>,
    private dialog: MatDialog,
    private _clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public editClient( cont ) {
    this.contAux = cont;
    console.log(this.data.client.length , cont , this.routeAux);
    if ( cont  === this.data.client.length ) {
      location.reload();
    } else {
      this._clientService._setClientsRouts(  this.routeAux , this.data.client[cont ].id ).then( ress => {
        setTimeout( () => {
          this.editClient( cont + 1 );
        }, 200);
      });
    }
  }

}
