import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseMenuComponent } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminActions } from '../../store/admin.actions';
import { AdminSelectors } from '../../store/admin.selectors';

@Component({
  selector: 'pry-admin-menu',
  templateUrl: '../../../lib/core/components/base-menu/base-menu.component.html'
})
export class AdminMenuComponent extends BaseMenuComponent {
  private limit$?: BehaviorSubject<string | undefined>;

  constructor(
    store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store);
    this.baseMenuTranslation = '@pry.admin.menus.';
    this.subscriptions.add(this.route.data.subscribe((data) => this.limit$?.next(data['limitMenu'])));
  }

  override init() {
    this.menus$ = this.store.select(AdminSelectors.menus);
    this.highlightedMenu$ = this.store.select(AdminSelectors.highlightedMenu);
    this.limit$ = new BehaviorSubject<string | undefined>(undefined);
    this.subMenu$ = combineLatest([this.store.select(AdminSelectors.subMenus), this.limit$]).pipe(
      map(([menus, limit]) => (limit ? menus.filter((menu) => menu.name === limit) : menus))
    );
  }

  override select(menu: string): void {
    const path = this.router.createUrlTree([menu], { relativeTo: this.route });
    this.store.dispatch(AdminActions.routeTo({ path: path.toString(), params: undefined }));
    this.store.dispatch(AdminActions.highlightMenu({ menu }));
  }
}
