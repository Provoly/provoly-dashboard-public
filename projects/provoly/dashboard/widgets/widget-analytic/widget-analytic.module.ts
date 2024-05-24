import { OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, CommonModule } from '@angular/common';
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
import { WidgetAnalyticComponent } from './component/widget-analytic.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryWidgetAnalyticCssComponent } from './style/css.component';
import { PryColorPickerModule } from '@provoly/dashboard/components/color-picker';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [WidgetAnalyticComponent, PryWidgetAnalyticCssComponent],
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
    AsyncPipe,
    PryColorPickerModule,
    DragDropModule
  ],
  exports: [WidgetAnalyticComponent]
})
export class WidgetAnalyticModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-vega', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-vega', enTranslations);
  }

  override getComponent() {
    return WidgetAnalyticComponent as Type<BaseWidgetComponent>;
  }
}
