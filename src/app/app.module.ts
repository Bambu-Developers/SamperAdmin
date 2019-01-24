import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'hammerjs';

/* ANGULAR MATERIAL */
import { MatButtonModule, MatInputModule, MatIconModule, MatPaginatorModule, MatTableModule } from '@angular/material';

/* FIREBASE */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

/*GLOBALS*/
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/*GUARDS*/
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

/*COMPONENTS*/
import { UiElementsComponent } from './components/ui-elements/ui-elements.component';


@NgModule({
  declarations: [
    AppComponent,
    UiElementsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
