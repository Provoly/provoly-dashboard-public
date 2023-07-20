import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseWidgetComponent,
  BaseWidgetModule,
  PryCoreModule,
  PryDashboardModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PryOverlayModule,
  PryRangeModule,
  PrySelectModule,
  PryToggleModule,
  TooltipFactoryService,
  tooltipLoader
} from '@provoly/dashboard';
import { WidgetGraphComponent } from './component/widget-graph.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryWidgetForceGraphCssComponent } from './style/css.component';

@NgModule({
  declarations: [WidgetGraphComponent, PryWidgetForceGraphCssComponent],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    PryCoreModule,
    PryDashboardModule,
    PrySelectModule,
    PryIconModule,
    PryToggleModule,
    PryOverlayModule,
    PryI18nModule,
    PryRangeModule
  ],
  exports: [WidgetGraphComponent]
})
export class WidgetGraphModule extends BaseWidgetModule {
  constructor(
    private tooltipFactoryService: TooltipFactoryService,
    private pryTranslateService: PryI18nService
  ) {
    super();

    this.pryTranslateService.addLangObject('fr', 'widget-graph', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-graph', enTranslations);

    this.tooltipFactoryService.addTooltipDefinitions({
      link: {
        name: 'link',
        load: () =>
          import('@provoly/dashboard/tooltips/cluster').then((module) =>
            tooltipLoader(module, 'PryClusterTooltipModule')
          )
      }
    });
  }

  override getComponent() {
    return WidgetGraphComponent as Type<BaseWidgetComponent>;
  }
}
