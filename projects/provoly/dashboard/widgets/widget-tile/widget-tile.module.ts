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
  PrySelectModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { WidgetDetailModule } from '@provoly/dashboard/widgets/widget-detail';
import { WidgetMapModule } from '@provoly/dashboard/widgets/widget-map';
import { WidgetTileComponent } from './component/widget-tile.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryWidgetTileCssComponent } from './style/css.component';

@NgModule({
  declarations: [WidgetTileComponent, PryWidgetTileCssComponent],
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
    WidgetDetailModule,
    WidgetMapModule,
    PryI18nModule
  ],
  exports: [WidgetTileComponent]
})
export class WidgetTileModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-tile', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-tile', enTranslations);
  }

  override getComponent() {
    return WidgetTileComponent as Type<BaseWidgetComponent>;
  }
}
