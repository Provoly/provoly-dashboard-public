import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryOverlayModule } from '../overlay/overlay.module';
import { PryToggleComponent } from './toggle.component';

const PRY_TOGGLE_COMPONENTS = [PryToggleComponent];

@NgModule({
  imports: [CommonModule, PryOverlayModule, PryI18nModule],
  declarations: [...PRY_TOGGLE_COMPONENTS],
  exports: [...PRY_TOGGLE_COMPONENTS]
})
export class PryToggleModule {}
