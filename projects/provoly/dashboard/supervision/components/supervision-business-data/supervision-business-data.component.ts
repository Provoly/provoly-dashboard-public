import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BusinessData, ClassActions, ClassSelectors } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-business-data',
  templateUrl: './supervision-business-data.component.html'
})
export class SupervisionBusinessDataComponent {
  datas$: Observable<BusinessData[]>;
  loading$: Observable<boolean>;

  sortActive? = 'name';
  sortDirection? = 'asc';

  constructor(private store: Store<any>) {
    this.store.dispatch(ClassActions.loadBusinessData());
    this.datas$ = this.store.select(ClassSelectors.classDatas);
    this.loading$ = this.store.select(SupervisionSelectors.loading);
    this.store.dispatch(
      SupervisionActions.mainActions({
        actions: [
          {
            action: ClassActions.loadBusinessData(),
            label: 'refresh',
            icon: 'synchro'
          }
        ]
      })
    );
  }
}
