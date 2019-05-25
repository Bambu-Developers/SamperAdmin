import { DateFormatPipe } from './../../pipes/date-format.pipe';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
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
  MatSnackBarModule,
  MatDialogModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatPaginatorIntl
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import {
  SatDatepickerModule,
  SatNativeDateModule
} from 'saturn-datepicker';

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
    ToastComponent,
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
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatPaginatorModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyDeQSZDAnz9i4fDbOyNUi0LJiJ-czWbJMg'
      apiKey: 'AIzaSyAskN-VARhdUaLDaeA9chNu4vpveNjNs4s'
    }),
    AgmSnazzyInfoWindowModule,
    SatDatepickerModule,
    SatNativeDateModule,
    // MatPaginatorIntl
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
    MatSnackBarModule,
    MatDialogModule,
    ToastComponent,
    MatProgressBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatPaginatorModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    SatDatepickerModule,
    SatNativeDateModule,
    // MatPaginatorIntl,
  ],
  providers: [
    AngularFireDatabase,
    { provide: FirestoreSettingsToken, useValue: {} },
    MatDatepickerModule,
    DatePipe,
    // DateFormatPipe,
    { provide: MatPaginatorIntl, useClass: PaginatorComponent }
  ],
  entryComponents: [
    SnackbarComponent,
    DialogComponent,
    ToastComponent
  ]
})
export class SharedModule { }
