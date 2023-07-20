import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  PryCoreModule,
  PryDashboardModule,
  PryDatePickerModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PryOverlayModule,
  PrySelectModule,
  PryShareModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCardModule } from '@provoly/dashboard/components/card';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PryExpandPanelModule } from '@provoly/dashboard/components/expand-panel';
import { PryFilterModule } from '@provoly/dashboard/components/filter';
import { ChooseWidgetComponent } from './components/choose-widget/choose-widget.component';
import { EditNamedQueryModalComponent } from './components/edit-named-query-modal/edit-named-query-modal.component';
import { EditNamedQueryComponent } from './components/edit-named-query/edit-named-query.component';
import { PrySaveQueryButtonComponent } from './components/save-query-button/save-query-button.component';
import { PrySaveQueryComponent } from './components/save-query/save-query.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PrySearchFulltextComponent } from './search-fulltext/search-fulltext/search-fulltext.component';
import { SearchFulltextEffects } from './search-fulltext/store/search-fulltext.effects';
import { PrySearchHomeComponent } from './search-home/search-home.component';
import { PrySearchComposedComponent } from './search-mono-class/components/search-composed/search-composed.component';
import { PrySearchConditionComponent } from './search-mono-class/components/search-condition/search-condition.component';
import { PrySearchMonoClassComponent } from './search-mono-class/components/search-mono-class/search-mono-class.component';
import { PrySearchOrderComponent } from './search-mono-class/components/search-order/search-order.component';
import { PrySearchSelectAttributeComponent } from './search-mono-class/components/search-select-attribute/search-select-attribute.component';
import { SearchMonoClassEffects } from './search-mono-class/store/search-mono-class.effects';
import { searchMonoClassFeatureKey, searchMonoClassReducer } from './search-mono-class/store/search-mono-class.reducer';
import { MultiClassConditionComponent } from './search-multi-class/components/multi-class-condition/multi-class-condition.component';
import { MultiClassFieldSelectionComponent } from './search-multi-class/components/multi-class-field-selection/multi-class-field-selection.component';
import { PrySearchMultiClassComponent } from './search-multi-class/components/search-multi-class/search-multi-class.component';
import { SearchMultiClassEffects } from './search-multi-class/store/search-multi-class.effects';
import {
  searchMultiClassFeatureKey,
  searchMultiClassReducer
} from './search-multi-class/store/search-multi-class.reducer';
import { PrySearchToolsComponent } from './search-tools/search-tools.component';
import { PrySearchCssComponent } from './style/css.component';

@NgModule({
  imports: [
    CommonModule,
    PryCoreModule,
    StoreModule.forFeature(searchMultiClassFeatureKey, searchMultiClassReducer),
    StoreModule.forFeature(searchMonoClassFeatureKey, searchMonoClassReducer),
    EffectsModule.forFeature([SearchMultiClassEffects, SearchMonoClassEffects, SearchFulltextEffects]),
    PryIconModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    PortalModule,
    PrySelectModule,
    PryToggleModule,
    PryOverlayModule,
    PryFilterModule,
    PryToggleModule,
    PryExpandPanelModule,
    PryCardModule,
    PryCheckboxModule,
    PryDashboardModule,
    PryShareModule,
    PryDatePickerModule,
    PryI18nModule
  ],
  declarations: [
    PrySearchComposedComponent,
    PrySearchSelectAttributeComponent,
    PrySearchConditionComponent,
    PrySaveQueryComponent,
    PrySearchToolsComponent,
    PrySearchHomeComponent,
    PrySearchMonoClassComponent,
    PrySaveQueryComponent,
    MultiClassConditionComponent,
    PrySearchMultiClassComponent,
    MultiClassFieldSelectionComponent,
    PrySearchFulltextComponent,
    PrySaveQueryButtonComponent,
    EditNamedQueryComponent,
    EditNamedQueryModalComponent,
    ChooseWidgetComponent,
    PrySearchOrderComponent,
    PrySearchCssComponent
  ],
  exports: [PrySearchToolsComponent, PrySearchFulltextComponent, EditNamedQueryModalComponent, ChooseWidgetComponent]
})
export class PrySearchModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'search', frTranslations);
    this.pryTranslateService.addLangObject('en', 'search', enTranslations);
  }
}
