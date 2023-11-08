import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BaseWidgetComponent,
  BaseWidgetModule,
  PryAggregationService,
  PryCoreModule,
  PryDashboardModule,
  PryEditInputModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PryRangeModule,
  PrySelectModule,
  PrySortModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { WidgetAggregatedChartComponent } from './component/widget-aggregated-chart.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryWidgetAggregatedChartCssComponent } from './style/css.component';
import { PryColorPickerModule } from '@provoly/dashboard/components/color-picker';
import { PrySchemePickerModule } from '@provoly/dashboard/components/scheme-picker';

@NgModule({
  declarations: [WidgetAggregatedChartComponent, PryWidgetAggregatedChartCssComponent],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    PryCoreModule,
    PryDashboardModule,
    PrySelectModule,
    PryIconModule,
    PryCheckboxModule,
    PryToggleModule,
    PryEditInputModule,
    PryI18nModule,
    PryRangeModule,
    PrySortModule,
    ReactiveFormsModule,
    PryColorPickerModule,
    PrySchemePickerModule
  ],
  exports: [WidgetAggregatedChartComponent],
  providers: [PryAggregationService]
})
export class WidgetAggregatedChartModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-aggregated-chart', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-aggregated-chart', enTranslations);
  }

  override getComponent() {
    return WidgetAggregatedChartComponent as Type<BaseWidgetComponent>;
  }
}
