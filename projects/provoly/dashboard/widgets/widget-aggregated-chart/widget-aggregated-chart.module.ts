import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseWidgetComponent,
  BaseWidgetModule,
  PryCoreModule,
  PryDashboardModule,
  PryEditInputModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PryRangeModule,
  PrySelectModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { WidgetAggregatedChartComponent } from './component/widget-aggregated-chart.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryAggregationService } from './service/base-aggregation.service';
import { PryWidgetAggregatedChartCssComponent } from './style/css.component';

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
    PryRangeModule
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
