import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseFilterComponent, BaseFilterModule, PryCoreModule, PryI18nModule, PryIconModule } from '@provoly/dashboard';
import { NumberFilterComponent } from './number-filter.component';

@NgModule({
  declarations: [NumberFilterComponent],
    imports: [CommonModule, FormsModule, OverlayModule, PryCoreModule, PryI18nModule, PryIconModule],
  exports: [NumberFilterComponent]
})
export class PryNumberFilterModule extends BaseFilterModule {
  override getComponent() {
    return NumberFilterComponent as Type<BaseFilterComponent>;
  }
}
