import { NgModule, Type } from '@angular/core';
import { BaseTooltipComponent } from './base-tooltip.component';
import { DefaultTooltipComponent } from './components/default/default.tooltip.component';

@NgModule({})
export class BaseTooltipModule {
  getComponent(): Type<BaseTooltipComponent> {
    return DefaultTooltipComponent;
  }
}
