import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Filter } from '../../core/model/filter.interface';
import { SubscriptionnerDirective } from '../components/subscriptionner.directive';
import { DashboardActions } from '../store/dashboard.actions';

@Component({ selector: 'pry-base-filter', template: '' })
export class BaseFilterComponent extends SubscriptionnerDirective {
  @Input() filter?: Filter;
  type!: string;

  constructor(protected store: Store) {
    super();
    this.type = 'base';
  }

  updateFilter(value: any) {
    if (this.filter) {
      this.filter.attributes.forEach((attribute) => {
        this.store.dispatch(
          DashboardActions.updateFilterValue({
            datasourceId: attribute.datasource,
            id: this.filter?.id ?? '',
            value
          })
        );
      });
    }
  }
}
