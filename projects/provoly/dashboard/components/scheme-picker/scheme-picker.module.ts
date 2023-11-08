import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrySchemePickerComponent } from './scheme-picker.component';
import { PryI18nModule, PryIconModule, PrySelectModule } from '@provoly/dashboard';
import { PryColorPickerModule } from '@provoly/dashboard/components/color-picker';

const PRY_SCHEMEPICKER_COMPONENTS = [PrySchemePickerComponent];

@NgModule({
  imports: [CommonModule, FormsModule, PryI18nModule, PrySelectModule, PryColorPickerModule, PryIconModule],
  declarations: [...PRY_SCHEMEPICKER_COMPONENTS],
  exports: [...PRY_SCHEMEPICKER_COMPONENTS]
})
export class PrySchemePickerModule {}
