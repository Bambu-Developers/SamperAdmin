import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: any,
    private snackBarRef: MatSnackBarRef<SnackbarComponent>
  ) { }

  ngOnInit() {
  }

  public close() {
    this.snackBarRef.dismiss();
  }
}
