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
import { WidgetTableComponent } from './component/widget-table.component';
import { DetachRowDirective } from './expand-value/detach-row.directive';
import { ExpandValueComponent } from './expand-value/expand-value.component';
import { GetValuePipe } from './get-value/get-value.pipe';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { ResizableComponent } from './resizable/resizable.component';
import { ResizableDirective } from './resizable/resizable.directive';
import { PryWidgetTableCssComponent } from './style/css.component';
import { PryDataFormatModule } from '@provoly/dashboard/components/data-format';

@NgModule({
  declarations: [
    WidgetTableComponent,
    GetValuePipe,
    ResizableComponent,
    ResizableDirective,
    PryWidgetTableCssComponent,
    ExpandValueComponent,
    DetachRowDirective
  ],
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
  exports: [WidgetTableComponent]
})
export class WidgetTableModule extends BaseWidgetModule {
  constructor(private pryTranslateService: PryI18nService) {
    super();
    this.pryTranslateService.addLangObject('fr', 'widget-table', frTranslations);
    this.pryTranslateService.addLangObject('en', 'widget-table', enTranslations);
  }

  override getComponent() {
    return WidgetTableComponent as Type<BaseWidgetComponent>;
  }
}
