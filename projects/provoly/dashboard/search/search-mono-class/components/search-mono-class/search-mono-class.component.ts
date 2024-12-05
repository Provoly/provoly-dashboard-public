import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Class, ClassSelectors, ClassState, SearchState } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs';
import { SearchMonoClassActions } from '../../store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';

@Component({
  selector: 'pry-search-mono-class',
  templateUrl: './search-mono-class.component.html'
})
export class PrySearchMonoClassComponent {
  classes$?: Observable<Array<Class>>;
  monoClass$?: Observable<Class>;
  monoClassMasterId$?: Observable<string | null>;
  monoClassId$: Observable<string | undefined>;

  constructor(private store: Store<SearchState | ClassState>) {
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.monoClassMasterId$ = this.store.select(SearchMonoClassSelectors.selectMonoClassConditionsMasterId);
    this.monoClassId$ = this.store.select(SearchMonoClassSelectors.selectMonoClassIdSearch);

    this.monoClass$ = this.store.select(SearchMonoClassSelectors.selectMonoClassIdSearch).pipe(
      filter((id): id is string => id !== null),
      switchMap((id) => this.store.select(ClassSelectors.classById(id))),
      filter((clazz): clazz is Class => clazz !== null)
    );
  }

  onChangeClass(classId: any) {
    this.store.dispatch(SearchMonoClassActions.addOrder({}));
    this.monoClassId$
      .pipe(
        take(1),
        filter((monoClassId) => monoClassId !== classId)
      )
      .subscribe(() => this.store.dispatch(SearchMonoClassActions.selectMonoClassSearch({ classId })));
  }
}
