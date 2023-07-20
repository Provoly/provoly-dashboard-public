import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule, PryIconModule, PryModalModule, PrySortModule } from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PryListMetadataComponent } from './pry-list-metadata.component';

@NgModule({
  declarations: [PryListMetadataComponent],
  exports: [PryListMetadataComponent],
  imports: [CommonModule, PrySortModule, PryIconModule, PryModalModule, FormsModule, PryCheckboxModule, PryI18nModule]
})
export class PryListMetadataModule {}
