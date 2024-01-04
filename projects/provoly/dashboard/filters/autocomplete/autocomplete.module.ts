import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BaseFilterComponent,
  BaseFilterModule,
  PryI18nModule,
  PryIconModule,
  PrySelectModule
} from '@provoly/dashboard';
import { AutocompleteComponent } from './autocomplete.component';
import { PryAutocompleteCssComponent } from './style/css.component';

@NgModule({
  declarations: [AutocompleteComponent, PryAutocompleteCssComponent],
  exports: [AutocompleteComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PrySelectModule, PryIconModule, PryI18nModule]
})
export class PryAutocompleteModule extends BaseFilterModule {
  override getComponent(): Type<BaseFilterComponent> {
    return AutocompleteComponent as Type<AutocompleteComponent>;
  }
}
