import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InputFlow } from '../../store/supervision-api.model';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-flow',
  templateUrl: './supervision-flow.component.html'
})
export class SupervisionFlowComponent {
  flows$: Observable<InputFlow[]>;
  loading$: Observable<boolean>;

  sortActive? = 'name';
  sortDirection? = 'asc';

  constructor(private store: Store<any>) {
    this.store.dispatch(SupervisionActions.loadFlows());
    this.flows$ = this.store.select(SupervisionSelectors.inputFlows);
    this.loading$ = this.store.select(SupervisionSelectors.loading);
    this.store.dispatch(
      SupervisionActions.mainActions({
        actions: [
          {
            action: SupervisionActions.loadFlows(),
            label: 'refresh',
            icon: 'synchro'
          }
        ]
      })
    );
  }
}
