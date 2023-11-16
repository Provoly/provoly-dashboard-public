import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Filter } from '../../core/model/filter.interface';
import { SubscriptionnerDirective } from '../components/subscriptionner.directive';
import { DashboardActions } from '../store/dashboard.actions';

@Component({ selector: 'pry-base-filter', template: '' })
export class BaseFilterComponent extends SubscriptionnerDirective implements OnInit {
  @Input() filter?: Filter;
  type!: string;
  protected _value: any;

  constructor(protected store: Store) {
    super();
    this.type = 'base';
  }

  ngOnInit() {
    this._value = this.filter?.value;
  }

  updateFilter(value: any) {
    this._value = value;
  }

  validateFilters() {
    if (this.filter) {
      this.filter.attributes.forEach((attribute) => {
        this.store.dispatch(
          DashboardActions.updateFilterValue({
            datasourceId: attribute.datasource,
            id: this.filter?.id ?? '',
            value: this._value
          })
        );
      });
    }
  }
}
