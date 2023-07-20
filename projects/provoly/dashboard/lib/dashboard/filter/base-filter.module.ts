import { NgModule, Type } from '@angular/core';
import { BaseFilterComponent } from './base-filter.component';

@NgModule({})
export class BaseFilterModule {
  getComponent(): Type<BaseFilterComponent> {
    throw new Error('Should implement a custom filter');
  }
}
