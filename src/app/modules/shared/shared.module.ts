import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { MomentModule } from 'ngx-moment';
import { ChartsModule } from 'ng2-charts';

import 'hammerjs';

/* ANGULAR MATERIAL */
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

import { LayoutModule } from '@angular/cdk/layout';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';

/* FIREBASE */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
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
      apiKey: 'AIzaSyAskN-VARhdUaLDaeA9chNu4vpveNjNs4s'
    }),
    AgmSnazzyInfoWindowModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MomentModule,
    ChartsModule
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
    MomentModule,
    ChartsModule
  ],
  providers: [
    AngularFireDatabase,
    { provide: SETTINGS, useValue: {} },
    MatDatepickerModule,
    DatePipe,
    { provide: MatPaginatorIntl, useClass: PaginatorComponent }
  ],
  entryComponents: [
    SnackbarComponent,
    DialogComponent,
    ToastComponent
  ]
})
export class SharedModule { }
