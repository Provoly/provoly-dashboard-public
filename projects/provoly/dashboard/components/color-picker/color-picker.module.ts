import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryColorPickerComponent } from './color-picker.component';

const PRY_COLORPICKER_COMPONENTS = [PryColorPickerComponent];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [...PRY_COLORPICKER_COMPONENTS],
  exports: [...PRY_COLORPICKER_COMPONENTS]
})
export class PryColorPickerModule {}
