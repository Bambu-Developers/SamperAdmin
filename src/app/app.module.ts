import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'hammerjs';

/* ANGULAR MATERIAL */
import { MatButtonModule, MatInputModule, MatIconModule } from '@angular/material';

/*GLOBALS*/
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/*GUARDS*/
import {  NoAuthGuard } from 'src/app/guards/noAuth/no-auth.guard';

/*MODULES*/
import { AccountModule } from 'src/app/modules/account/account.module';
import { UiElementsComponent } from './components/ui-elements/ui-elements.component';



@NgModule({
  declarations: [
    AppComponent,
    UiElementsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccountModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [
    NoAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
