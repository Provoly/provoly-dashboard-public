import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MultiClassCondition } from '@provoly/dashboard';
import { Observable, take } from 'rxjs';
import { SearchMultiClassActions } from '../../store/search-multi-class.actions';
import { SearchMultiClassSelectors } from '../../store/search-multi-class.selectors';

@Component({
  selector: 'pry-search-multi-class',
  templateUrl: './search-multi-class.component.html'
})
export class PrySearchMultiClassComponent {
  conditions$: Observable<MultiClassCondition[]>;
  multiType$: Observable<'AND' | 'OR'>;

  optionsOpen = false;

  constructor(private store: Store<any>) {
    this.conditions$ = this.store.select(SearchMultiClassSelectors.conditions);
    this.multiType$ = this.store.select(SearchMultiClassSelectors.multiType);
    this.conditions$.pipe(take(1)).subscribe((conditions) => {
      if ((conditions?.length ?? 0) === 0) {
        this.store.dispatch(SearchMultiClassActions.addNewEmptyCondition());
      }
    });
  }

  onAddCondition() {
    this.store.dispatch(SearchMultiClassActions.addNewEmptyCondition());
  }

  onChangeMultiType(evt: any) {
    const multiType = evt ? 'OR' : 'AND';
    this.store.dispatch(SearchMultiClassActions.updateMultiType({ multiType }));
  }
}
