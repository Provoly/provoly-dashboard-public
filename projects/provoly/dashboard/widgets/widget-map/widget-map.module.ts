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
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { WidgetMapComponent } from './component/widget-map.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { GeometryFieldsForPipe } from './pipe/widget-map-geometry-fields-for.pipe';
import { WidgetMapLegendUrlPipe } from './pipe/widget-map-legend-url.pipe';
import { PryWidgetMapCssComponent } from './style/css.component';

@NgModule({
  declarations: [WidgetMapComponent, GeometryFieldsForPipe, PryWidgetMapCssComponent, WidgetMapLegendUrlPipe],
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
    PryOverlayModule,
    PryI18nModule,
    PryRangeModule
  ],
  exports: [WidgetMapComponent]
})
export class WidgetMapModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-map', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-map', enTranslations);
  }

  override getComponent() {
    return WidgetMapComponent as Type<BaseWidgetComponent>;
  }
}
