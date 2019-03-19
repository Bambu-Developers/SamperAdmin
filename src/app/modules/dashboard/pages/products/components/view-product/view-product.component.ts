import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/modules/dashboard/pages/products/services/products.service';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { DialogComponent } from 'src/app/modules/shared/components/dialog/dialog.component';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit, OnDestroy {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  private _subscription: Subscription;
  private _subscriptionService: Subscription;
  public id: string;
  public dataSource: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getProduct();
  }

  public getProduct() {
    this._subscription = this.route.params.subscribe(params  => {
      this.id = params['id'];
      this._subscriptionService = this.productService.getProduct(this.id).subscribe(
        res => {
          this.dataSource = res;
        });
    });
  }

  public editProduct() {
    this.router.navigate(['/dashboard/products/edit/' + this.id]);
  }

  public removeProduct() {
    this.productService.removeProduct(this.id);
    this.openSnackBar();
  }

  public openSnackBar() {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: PRODUCTS_LANGUAGE.snackbarDeleted
      }
    });
  }

  public openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {text: PRODUCTS_LANGUAGE.dialogDelete, accept: true}
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.removeProduct();
        }
      }
    );
  }

  ngOnDestroy() {
    if ( this._subscription ) {
      this._subscription.unsubscribe();
    }
    if ( this._subscriptionService ) {
      this._subscriptionService.unsubscribe();
    }
   }

}
