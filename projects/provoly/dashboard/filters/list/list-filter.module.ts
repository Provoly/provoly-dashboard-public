import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseFilterComponent, BaseFilterModule, PryI18nModule, PrySelectModule } from '@provoly/dashboard';
import { ListFilterComponent } from './list-filter.component';
import { PryListFilterCssComponent } from './style/css.component';

@NgModule({
  declarations: [ListFilterComponent, PryListFilterCssComponent],
  exports: [ListFilterComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PrySelectModule, PryI18nModule]
})
export class PryListFilterModule extends BaseFilterModule {
  override getComponent(): Type<BaseFilterComponent> {
    return ListFilterComponent as Type<ListFilterComponent>;
  }
}
