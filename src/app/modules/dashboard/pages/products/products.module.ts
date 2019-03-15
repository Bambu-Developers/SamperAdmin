import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { ProductsRoutingModule } from 'src/app/modules/dashboard/pages/products/products-routing.module';

/*MODULES*/
import { SharedModule } from 'src/app/modules/shared/shared.module';

/*COMPONENTS*/
import { ProductsComponent } from 'src/app/modules/dashboard/pages/products/products.component';
import { RegisterProductComponent } from 'src/app/modules/dashboard/pages/products/components/register-product/register-product.component';

@NgModule({
  declarations: [ProductsComponent, RegisterProductComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
