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
import { WidgetIframeComponent } from './component/widget-iframe.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { IframeMessagingService } from './messaging/iframe-messaging.service';
import { PryWidgetIframeCssComponent } from './style/css.component';

@NgModule({
  declarations: [WidgetIframeComponent, PryWidgetIframeCssComponent],
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
    PryI18nModule
  ],
  providers: [IframeMessagingService],
  exports: [WidgetIframeComponent]
})
export class WidgetIframeModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-iframe', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-iframe', enTranslations);
  }

  override getComponent() {
    return WidgetIframeComponent as Type<BaseWidgetComponent>;
  }
}
