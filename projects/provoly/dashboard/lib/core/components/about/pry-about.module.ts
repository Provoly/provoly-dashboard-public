import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryIconModule } from '../icon/icon.module';
import { PryAboutComponent } from './about.component';

const PRY_ABOUT_COMPONENTS = [PryAboutComponent];

@NgModule({
  imports: [CommonModule, PryIconModule, PryI18nModule],
  declarations: [...PRY_ABOUT_COMPONENTS],
  exports: [...PRY_ABOUT_COMPONENTS]
})
export class PryAboutModule {}
