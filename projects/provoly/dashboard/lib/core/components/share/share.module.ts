import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PrySelectModule } from '../select/select.module';
import { PryShareComponent } from './share.component';
import { PryGroupShareComponent } from './group-share/group-share.component';
import { PryCoreModule } from '../../core.module';
import { PryDashboardModule } from '../../../dashboard/dashboard.module';

@NgModule({
  imports: [CommonModule, FormsModule, PrySelectModule, PryI18nModule, PryCoreModule, PryDashboardModule],
  declarations: [PryShareComponent, PryGroupShareComponent],
  exports: [PryShareComponent, PryGroupShareComponent]
})
export class PryShareModule {}
