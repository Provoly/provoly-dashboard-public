import { Component, ComponentRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, filter, Observable } from 'rxjs';
import { SubscriptionnerDirective } from '../../../dashboard/components/subscriptionner.directive';
import { BaseMenuItem } from '../base-menu/base-menu.component';

@Component({
  selector: 'pry-base-layout',
  templateUrl: './base-layout.component.html'
})
export class BaseLayoutComponent extends SubscriptionnerDirective {
  instanciatedComponent!: ComponentRef<any>;
  menus$?: Observable<BaseMenuItem[]>;
  menuOpen$?: Observable<boolean>;
  navigationEnd$: Observable<NavigationEnd>;

  constructor(
    protected store: Store<any>,
    protected router: Router
  ) {
    super();
    this.init();
    this.navigationEnd$ = this.router.events.pipe(filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd));
    if (!this.menus$) {
      console.error('menus$ must be initialized in init');
    } else {
      this.subscriptions.add(
        combineLatest([this.menus$, this.navigationEnd$])
          .pipe(debounceTime(10))
          .subscribe(([menus, navigation]) => {
            // Search for menu to highlight based on url (reverse)
            const navSplit = navigation.urlAfterRedirects.split('/').reverse();
            const menu = navSplit.find((navPart) => {
              return menus.find((menu) => navPart === menu.menu) !== undefined;
            });
            this.highlightMenu(menu ?? '');
          })
      );
    }
  }

  init() {
    console.error('Must override init function');
  }

  highlightMenu(menu: string) {
    console.error('Must override highLightMenu function');
  }
}
