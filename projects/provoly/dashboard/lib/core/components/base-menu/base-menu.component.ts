import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SubscriptionnerDirective } from '../../../dashboard/components/subscriptionner.directive';

export interface BaseMenuItem {
  menu: string;
  module?: string;
  page?: string;
  subMenu?: string;
}

export interface SubMenu {
  name?: string;
  icon: string;
  subMenus: BaseMenuItem[];
}

@Component({
  selector: 'pry-base-menu',
  templateUrl: './base-menu.component.html'
})
export class BaseMenuComponent extends SubscriptionnerDirective {
  baseMenuTranslation = '';
  menus$?: Observable<BaseMenuItem[]>;
  subMenu$?: Observable<SubMenu[]>;
  highlightedMenu$?: Observable<string>;

  constructor(protected store: Store<any>) {
    super();
    this.init();
  }

  select(menu: string): void {
    console.error('Must override select function');
  }

  init(): void {
    console.error('Must override init function');
  }
}
