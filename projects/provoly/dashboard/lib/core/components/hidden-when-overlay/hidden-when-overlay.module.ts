import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryOverlayModule } from '../overlay/overlay.module';
import { PryHiddenWhenOverlayDirective } from './hidden-when-overlay.directive';

const PRY_TOGGLE_COMPONENTS = [PryHiddenWhenOverlayDirective];

@NgModule({
  imports: [CommonModule, PryOverlayModule],
  declarations: [...PRY_TOGGLE_COMPONENTS],
  exports: [...PRY_TOGGLE_COMPONENTS]
})
export class PryHiddenWhenOverlay {}
