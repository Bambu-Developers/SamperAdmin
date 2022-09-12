import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BonafontAdmin';

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry
      .addSvgIcon('ic-eye', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-eye.svg'))
      .addSvgIcon('ic-stock', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-inventario-off.svg'))
      .addSvgIcon('ic-analytics', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-analytics-off.svg'))
      .addSvgIcon('ic-products', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-productos-off.svg'))
      .addSvgIcon('ic-users', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-usuarios-off.svg'))
      .addSvgIcon('ic-clients', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-clientes-off.svg'))
      .addSvgIcon('ic-back', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-vendedor-back-gray.svg'))
      .addSvgIcon('ic-before', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/before.svg'))
      .addSvgIcon('ic-next', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/next.svg'))
      .addSvgIcon('ic-edit', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-edit-gray.svg'))
      .addSvgIcon('ic-dropdown', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic-icon-dropdown-orange.svg'))
      .addSvgIcon('ic-close-circle', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/close-circle.svg'))
      .addSvgIcon('ic-close-grey', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-close-grey.svg'))
      .addSvgIcon('ic-calendar', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/icon-calendar-orange.svg'))
      .addSvgIcon('ic-group-2', sanitizer.bypassSecurityTrustResourceUrl('assets/images/group-2.svg'))
      ;

  }
}
