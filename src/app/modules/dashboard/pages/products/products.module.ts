import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { ProductsRoutingModule } from 'src/app/modules/dashboard/pages/products/products-routing.module';

/*MODULES*/
import { SharedModule } from 'src/app/modules/shared/shared.module';

/*COMPONENTS*/
import { ProductsComponent } from 'src/app/modules/dashboard/pages/products/products.component';
import { RegisterProductComponent } from 'src/app/modules/dashboard/pages/products/components/register-product/register-product.component';
import { ViewProductComponent } from 'src/app/modules/dashboard/pages/products/components/view-product/view-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { RegisterPromotionComponent } from './components/register-promotion/register-promotion.component';

@NgModule({
  declarations: [ProductsComponent, RegisterProductComponent, ViewProductComponent, EditProductComponent, RegisterPromotionComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
