import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IntegrationError } from '../../../store/supervision-api.model';
import { SupervisionActions } from '../../../store/supervision.actions';
import { SupervisionSelectors } from '../../../store/supervision.selectors';

let nextCompId = 0;

@Component({
  selector: 'pry-supervision-integration-errors-select',
  templateUrl: './supervision-integration-errors-select.component.html'
})
export class SupervisionIntegrationErrorsSelectComponent {
  tab: number = 0;
  compId: number = nextCompId++;
  currentIntegrationError$: Observable<IntegrationError | null | undefined>;

  constructor(private store: Store<any>) {
    this.currentIntegrationError$ = this.store.select(SupervisionSelectors.currentIntegrationError);
  }

  closePanel() {
    this.store.dispatch(SupervisionActions.loadIntegrationErrors());
    this.store.dispatch(SupervisionActions.toggleErrorDetails({ error: null, errorDetailsOpen: false }));
  }
}
