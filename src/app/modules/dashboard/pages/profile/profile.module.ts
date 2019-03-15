import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ToastComponent } from '../../components/toast/toast.component';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
  ],
  entryComponents: []
})
export class ProfileModule { }
