import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
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
  MatCardModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDialogModule
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
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ToastComponent } from '../dashboard/components/toast/toast.component';

@NgModule({
  declarations: [
    PaginatorComponent,
    SnackbarComponent,
    DialogComponent,
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
    MatCardModule,
    TextMaskModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
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
    MatCardModule,
    TextMaskModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    ToastComponent
  ],
  providers: [
    AngularFireDatabase,
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  entryComponents: [SnackbarComponent,
                    DialogComponent, ToastComponent]
})
export class SharedModule { }
