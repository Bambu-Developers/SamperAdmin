import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SanperAdmin';

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { 
    iconRegistry
    .addSvgIcon('ic-eye',sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-eye.svg'))
  }

}
