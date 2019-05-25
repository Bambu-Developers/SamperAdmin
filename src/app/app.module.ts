import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

/*GLOBALS*/
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/*GUARDS*/
import { AuthGuard } from 'src/app/guards/auth/auth.guard';
import { NoAuthGuard } from './guards/no-auth/no-auth.guard';

/*COMPONENTS*/
import { UiElementsComponent } from './components/ui-elements/ui-elements.component';

/*MODULES*/
import { SharedModule } from './modules/shared/shared.module';
import { DateFormatPipe } from './pipes/date-format.pipe';


@NgModule({
  declarations: [
    AppComponent,
    UiElementsComponent,
    DateFormatPipe
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
    DateFormatPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
