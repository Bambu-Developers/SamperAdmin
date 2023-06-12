import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DASHBOARD_LANGUAGE } from 'src/app/modules/dashboard/data/language';
import { AuthService } from 'src/app/modules/account/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map( (result) => {
        return result.matches;
      })
    );

  public language = DASHBOARD_LANGUAGE.navbar;
  public days = DASHBOARD_LANGUAGE.navbar.days;
  public months = DASHBOARD_LANGUAGE.navbar.months;

  public items = [
    // {
    //   icon: 'ic-stock',
    //   title: DASHBOARD_LANGUAGE.navbar.calc,
    //   route: '/dashboard/inventory'
    // },
    {
      icon: '',
      title: DASHBOARD_LANGUAGE.navbar.history,
      route: '/dashboard/inventory/history'
    },
    // {
    //   icon: '',
    //   title: DASHBOARD_LANGUAGE.navbar.historyLiquidation,
    //   route: '/dashboard/inventory/history-liquidation'
    // },
    // {
    //   icon: 'ic-analytics',
    //   title: DASHBOARD_LANGUAGE.navbar.analitycs,
    //   route: '/dashboard/analytics'
    // },
    // {
    //   icon: 'ic-analytics',
    //   title:  'credit',
    //   route: '/dashboard/credit'
    // },
    // {
    //   icon: '',
    //   title: DASHBOARD_LANGUAGE.navbar.clients,
    //   route: '/dashboard/analytics/clients'
    // },
    {
      icon: 'ic-products',
      title: DASHBOARD_LANGUAGE.navbar.products,
      route: '/dashboard/products'
    },
    {
      icon: 'ic-users',
      title: DASHBOARD_LANGUAGE.navbar.users,
      route: '/dashboard/users'
    },
    {
      icon: 'ic-clients',
      title: DASHBOARD_LANGUAGE.navbar.clients,
      route: '/dashboard/clients'
    },
    {
      icon: '',
      title: DASHBOARD_LANGUAGE.navbar.routes,
      route: '/dashboard/routes'
    },
  ];
  public date = new Date;
  public email = '';
  public current: string;
  public login = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,
  ) {
    this.email = this.authService.getUser();
    this.current = this.router.url;
  }

  ngOnInit() {
    window.setTimeout(() => {
      this.login = true;
    }, 2000);
  }

  public logout() {
    this.authService.logout().then();
  }

}
