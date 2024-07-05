import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseTooltipComponent, BaseTooltipModule, PryCoreModule } from '@provoly/dashboard';
import { AttributeTooltipComponent } from './attribute-tooltip.component';
import { PryDataFormatModule } from '@provoly/dashboard/components/data-format';

@NgModule({
  declarations: [AttributeTooltipComponent],
  imports: [CommonModule, FormsModule, OverlayModule, PryCoreModule, PryDataFormatModule],
  exports: [AttributeTooltipComponent]
})
export class PryAttributeTooltipModule extends BaseTooltipModule {
  override getComponent() {
    return AttributeTooltipComponent as Type<BaseTooltipComponent>;
  }
}
