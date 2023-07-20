import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseMenuComponent } from '@provoly/dashboard';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-menu',
  templateUrl: '../../../lib/core/components/base-menu/base-menu.component.html'
})
export class SupervisionMenuComponent extends BaseMenuComponent {
  constructor(
    store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(store);
    this.baseMenuTranslation = '@pry.supervision.menus.';
  }

  override init() {
    this.menus$ = this.store.select(SupervisionSelectors.menus);
    this.highlightedMenu$ = this.store.select(SupervisionSelectors.highlightedMenu);
  }

  override select(menu: string): void {
    const path = this.router.createUrlTree([menu], { relativeTo: this.route });
    this.store.dispatch(SupervisionActions.routeTo({ path: path.toString() }));
  }
}
