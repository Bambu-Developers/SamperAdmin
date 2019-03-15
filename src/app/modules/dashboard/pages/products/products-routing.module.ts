import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from 'src/app/modules/dashboard/pages/products/products.component';
import { RegisterProductComponent } from 'src/app/modules/dashboard/pages/products/components/register-product/register-product.component';
import { ViewProductComponent } from 'src/app/modules/dashboard/pages/products/components/view-product/view-product.component';
import { EditProductComponent } from 'src/app/modules/dashboard/pages/products/components/edit-product/edit-product.component';


const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'register',
    component: RegisterProductComponent,
  },
  {
    path: 'view/:id',
    component: ViewProductComponent,
  },
  {
    path: 'edit/:id',
    component: EditProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
