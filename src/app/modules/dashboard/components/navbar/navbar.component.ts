import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DASHBOARD_LANGUAGE } from 'src/app/modules/dashboard/data/language';
import { AuthService } from 'src/app/modules/account/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  public language = DASHBOARD_LANGUAGE.navbar;
  public days = DASHBOARD_LANGUAGE.navbar.days;
  public months = DASHBOARD_LANGUAGE.navbar.months;

  public items = [
    {
      icon: 'ic-stock',
      title: DASHBOARD_LANGUAGE.navbar.stock,
      route: 'stock'
    },
    {
      icon: 'ic-analytics',
      title: DASHBOARD_LANGUAGE.navbar.analitycs,
      route: 'analitycs'
    },
    {
      icon: 'ic-products',
      title: DASHBOARD_LANGUAGE.navbar.products,
      route: 'products'
    },
    {
      icon: 'ic-users',
      title: DASHBOARD_LANGUAGE.navbar.users,
      route: 'users'
    },
    {
      icon: 'ic-clients',
      title: DASHBOARD_LANGUAGE.navbar.clients,
      route: 'clients'
    }
  ];
  public date = new Date;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {  }

  public logout() {
    this.authService.logout().then();
  }

}
