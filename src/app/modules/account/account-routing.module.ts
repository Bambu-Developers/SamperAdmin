import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NoAuthGuard } from 'src/app/guards/noAuth/no-auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[NoAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { 
  
}
