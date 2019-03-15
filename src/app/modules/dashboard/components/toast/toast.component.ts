import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public toastRef: MatSnackBarRef<ToastComponent>,
  ) { }
}
