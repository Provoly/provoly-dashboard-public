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
import { WidgetDetailComponent } from './component/widget-detail.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryWidgetDetailCssComponent } from './style/css.component';
import { PryDataFormatModule } from '@provoly/dashboard/components/data-format';

@NgModule({
  declarations: [WidgetDetailComponent, PryWidgetDetailCssComponent],
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
    PryI18nModule,
    PryDataFormatModule
  ],
  exports: [WidgetDetailComponent]
})
export class WidgetDetailModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-detail', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-detail', enTranslations);
  }

  override getComponent() {
    return WidgetDetailComponent as Type<BaseWidgetComponent>;
  }
}
