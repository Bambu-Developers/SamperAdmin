import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PRODUCTS_LANGUAGE } from 'src/app/modules/dashboard/pages/products/data/language';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public language = PRODUCTS_LANGUAGE;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef: MatDialogRef<DialogComponent>,
  ) { }

  ngOnInit() {
  }

  public removeProduct() {
  }

  public accept() {
    this.dialogRef.close(this.data.accept);
  }

  public close() {
    this.dialogRef.close();
  }
}
