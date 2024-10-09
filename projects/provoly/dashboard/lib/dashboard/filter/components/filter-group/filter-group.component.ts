import { Component, Inject, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalManifest } from '../../../../core/model/manifest.interface';
import { DashboardSelectors } from '../../../store/dashboard.selectors';
import { DashboardActions } from '../../../store/dashboard.actions';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'pry-filter-group',
  templateUrl: './filter-group.component.html'
})
export class FilterGroupComponent {
  globalManifest$: Observable<GlobalManifest>;
  apply$ = new BehaviorSubject<void>(undefined);
  isSelectOpen = false;
  @Input() enterTriggerFilter = false;

  constructor(
    protected store: Store,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.globalManifest$ = this.store.select(DashboardSelectors.globalManifest);
  }

  filter() {
    this.apply$.next();
    this.store.dispatch(DashboardActions.dispatchFilters());
  }

  clearFilters() {
    this.store.dispatch(DashboardActions.clearAllFilterValues());
  }

  openSelect() {
    this.isSelectOpen =
      this.document
        .querySelector('.o-container__filter-container')
        ?.contains(document.querySelector('ng-dropdown-panel.ng-dropdown-panel')) || false;
  }
}
