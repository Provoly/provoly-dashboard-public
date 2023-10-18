import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryIconModule } from '../icon/icon.module';
import { PryDialogConfirmComponent } from './dialog-confirm.component';
import { PryOverlayDirective } from './overlay.directive';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [PryOverlayDirective, PryDialogConfirmComponent],
  exports: [PryOverlayDirective, PryDialogConfirmComponent],
  imports: [CommonModule, OverlayModule, PryIconModule, PryI18nModule, A11yModule]
})
export class PryOverlayModule {}
