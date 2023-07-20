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
import { WidgetChartComponent } from './component/widget-chart.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryWidgetChartCssComponent } from './style/css.component';

@NgModule({
  declarations: [WidgetChartComponent, PryWidgetChartCssComponent],
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
  exports: [WidgetChartComponent]
})
export class WidgetChartModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-chart', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-chart', enTranslations);
  }

  override getComponent() {
    return WidgetChartComponent as Type<BaseWidgetComponent>;
  }
}
