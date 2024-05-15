import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PrySelectModule } from '../select/select.module';
import { PryShareComponent } from './legacy-share/share.component';
import { PryGroupShareComponent } from './group-share/group-share.component';
import { PryCoreModule } from '../../core.module';
import { PryDashboardModule } from '../../../dashboard/dashboard.module';
import { PryAccessRightsShareComponent } from './access-rights-share/access-rights-share.component';
import { PryIconModule } from '../icon/icon.module';
import { PryAccessRightsShareModalComponent } from './access-rights-share-modal/access-rights-share-modal.component';

const COMPONENTS = [
  PryShareComponent,
  PryGroupShareComponent,
  PryAccessRightsShareComponent,
  PryAccessRightsShareModalComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrySelectModule,
    PryI18nModule,
    PryCoreModule,
    PryDashboardModule,
    PryIconModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class PryShareModule {}
