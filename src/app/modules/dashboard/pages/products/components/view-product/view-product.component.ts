import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/modules/shared/components/snackbar/snackbar.component';
import { DialogComponent } from 'src/app/modules/shared/components/dialog/dialog.component';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';
import { ACCOUNT_LANGUAGE } from 'src/app/modules/account/data/language';
import { SNACKBAR_CONFIG } from 'src/app/modules/dashboard/pages/products/data/data';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit, OnDestroy {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  public id: string;
  public dataSource: any;
  private _subscription: Subscription;
  private _subscriptionService: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.getProduct();
  }

  public getProduct() {
    this._subscription = this._route.params.subscribe(params => {
      this.id = params['id'];
      this._subscriptionService = this.productService.getProductId(this.id).subscribe(
        res => {
          this.dataSource = res;
        });
    });
  }

  public editProduct() {
    this._router.navigate(['/dashboard/products/edit/' + this.id]);
  }

  public registerPromotion() {
    this._router.navigate(['/dashboard/products/register-promotion/' + this.id]);
  }

  public editPromotion() {
    this._router.navigate(['/dashboard/products/edit-promotion/' + this.id]);
  }

  public removeProduct() {
    this.productService.removeProduct(this.id);
    this._router.navigate(['/dashboard/products/']);
    this.openSnackBarDeleted();
  }

  public removePromotion() {
    this.productService.removePromotion(this.id);
    this.openSnackBarPromoDeleted();
    this._router.navigate(['/dashboard/products/view/' + this.id]);
  }

  public setDisponibility(event) {
    if (event.checked === true) {
      this.productService.setDisponibility(this.id, event.checked);
    } else {
      this.openDialogDisable(event.checked);
    }
  }

  public openSnackBarDeleted() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: PRODUCTS_LANGUAGE.snackbarDeleted
      }
    });
  }

  public openSnackBarPromoDeleted() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: PRODUCTS_LANGUAGE.snackbarPromoDeleted
      }
    });
  }

  public openSnackBarDisabled() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      duration: SNACKBAR_CONFIG.duration,
      verticalPosition: SNACKBAR_CONFIG.verticalPosition,
      horizontalPosition: SNACKBAR_CONFIG.horizontalPosition,
      data: {
        text: PRODUCTS_LANGUAGE.snackbarDisabled
      }
    });
  }

  public openDialogDisable(eventValue) {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        text: PRODUCTS_LANGUAGE.dialogDisable,
        accept: true,
        action: PRODUCTS_LANGUAGE.disable
      }
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.productService.setDisponibility(this.id, eventValue);
          this.openSnackBarDisabled();
        }
      }
    );
  }

  public openDialogDelete() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        text: PRODUCTS_LANGUAGE.dialogDelete,
        accept: true,
        action: PRODUCTS_LANGUAGE.remove
      }
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.removeProduct();
        }
      }
    );
  }

  public openDialogDeletePromo() {
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        text: PRODUCTS_LANGUAGE.dialogDeletePromo,
        accept: true,
        action: PRODUCTS_LANGUAGE.delete
      }
    });
    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.removePromotion();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
    if (this._subscriptionService) {
      this._subscriptionService.unsubscribe();
    }
  }

}
