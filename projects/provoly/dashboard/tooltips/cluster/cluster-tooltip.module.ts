import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseTooltipComponent, BaseTooltipModule } from '@provoly/dashboard';
import { ClusterTooltipComponent } from './cluster-tooltip.component';

@NgModule({
  declarations: [ClusterTooltipComponent],
  imports: [CommonModule, FormsModule, OverlayModule],
  exports: [ClusterTooltipComponent]
})
export class PryClusterTooltipModule extends BaseTooltipModule {
  override getComponent() {
    return ClusterTooltipComponent as Type<BaseTooltipComponent>;
  }
}
