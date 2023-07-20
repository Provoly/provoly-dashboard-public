import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SubscriptionnerDirective } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { AdminSelectors } from '../../store/admin.selectors';

@Component({
  selector: 'pry-admin-title',
  templateUrl: './admin-title.component.html'
})
export class AdminTitleComponent extends SubscriptionnerDirective {
  menuOpen$: Observable<boolean>;
  limit: any;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute
  ) {
    super();
    this.menuOpen$ = this.store.select(AdminSelectors.menuOpen);
    this.subscriptions.add(this.route.data.subscribe((data) => (this.limit = data['limitMenu'])));
  }

  onToggleMenu($event: any) {
    this.store.dispatch(AdminActions.toggleMenu());

    // Toggle button aria-pressed
    $event.target.setAttribute(
      'aria-pressed',
      $event.target.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'
    );
  }
}
