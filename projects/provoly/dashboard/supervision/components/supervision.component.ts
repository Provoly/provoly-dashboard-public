import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SupervisionActions } from '../store/supervision.actions';
import { SupervisionState } from '../store/supervision.reducer';

@Component({
  selector: 'pry-supervision',
  templateUrl: './supervision.component.html'
})
export class PrySupervisionComponent {
  constructor(private store: Store<SupervisionState>) {
    this.store.dispatch(SupervisionActions.resetActions());
    this.store.dispatch(SupervisionActions.toggleErrorDetails({ error: null, errorDetailsOpen: false }));
  }
}
