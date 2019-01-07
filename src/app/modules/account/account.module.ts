import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*ROUTES*/
import { AccountRoutingModule } from './account-routing.module';

/*COMPONENTS*/
import { AccountComponent } from './account.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [AccountComponent, LoginComponent],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
