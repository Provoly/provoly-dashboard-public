import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, startWith } from 'rxjs';
import { IntegrationError } from '../../../store/supervision-api.model';
import { SupervisionActions } from '../../../store/supervision.actions';
import { SupervisionSelectors } from '../../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-integration-errors-select',
  templateUrl: './supervision-integration-errors-select.component.html'
})
export class SupervisionIntegrationErrorsSelectComponent {
  currentIntegrationError$: Observable<IntegrationError | undefined>;

  constructor(private store: Store<any>) {
    this.currentIntegrationError$ = this.store
      .select(SupervisionSelectors.currentIntegrationError)
      .pipe(startWith(null as unknown as IntegrationError));
  }

  closePanel() {
    this.store.dispatch(SupervisionActions.loadIntegrationErrors());
    this.store.dispatch(SupervisionActions.toggleErrorDetails({ error: undefined, errorDetailsOpen: false }));
  }
}
