import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-title',
  templateUrl: './supervision-title.component.html'
})
export class SupervisionTitleComponent {
  menuOpen$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.menuOpen$ = this.store.select(SupervisionSelectors.menuOpen);
  }

  onToggleMenu($event: any) {
    this.store.dispatch(SupervisionActions.toggleMenu());

    // Toggle button aria-pressed
    $event.target.setAttribute(
      'aria-pressed',
      $event.target.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'
    );
  }
}
