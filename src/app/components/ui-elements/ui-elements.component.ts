import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-ui-elements',
  templateUrl: './ui-elements.component.html',
  styleUrls: ['./ui-elements.component.scss']
})
export class UiElementsComponent implements OnInit {

  public nameFormControl = new FormControl('', [Validators.required]);
  public passwordFormControl = new FormControl('', [Validators.required]);

  constructor() { }

  ngOnInit() {
  }

}
