import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { ProductsRoutingModule } from './products-routing.module';

/*MODULES*/
import { SharedModule } from 'src/app/modules/shared/shared.module';

/*COMPONENTS*/
import { ProductsComponent } from './products.component';
import { RegisterProductComponent } from './components/register-product/register-product.component';

@NgModule({
  declarations: [ProductsComponent, RegisterProductComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
