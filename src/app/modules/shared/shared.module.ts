import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'hammerjs';


/* ANGULAR MATERIAL */
import {
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatTableModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatCheckboxModule,
  MatSnackBarModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';

/* FIREBASE */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { environment } from '../../../environments/environment';

/*SHARED COMPONENTS*/
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ToastComponent } from '../dashboard/components/toast/toast.component';

@NgModule({
  declarations: [
    PaginatorComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  exports: [
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    PaginatorComponent,
    MatRadioModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSnackBarModule,
    ToastComponent
  ],
  providers: [
    AngularFireDatabase,
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  entryComponents: [
    ToastComponent
  ]
})
export class SharedModule { }
