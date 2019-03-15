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

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit, OnDestroy {

  public lanProduct = PRODUCTS_LANGUAGE;
  public language = ACCOUNT_LANGUAGE;
  private subscription: Subscription;
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
    this.subscription = this.route.params.subscribe(params  => {
      this.id = params['id'];
      this.productService.getProduct(this.id).subscribe(
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
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      data: {text: PRODUCTS_LANGUAGE.snackbarDeleted}
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
    this.subscription.unsubscribe();
  }

}
