import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseFilterComponent, BaseFilterModule, PryCoreModule, PryI18nModule, PryIconModule } from '@provoly/dashboard';
import { TextFilterComponent } from './text-filter.component';

@NgModule({
  declarations: [TextFilterComponent],
    imports: [CommonModule, FormsModule, OverlayModule, PryCoreModule, PryI18nModule, PryIconModule],
  exports: [TextFilterComponent]
})
export class PryTextFilterModule extends BaseFilterModule {
  override getComponent() {
    return TextFilterComponent as Type<BaseFilterComponent>;
  }
}
