import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryCheckboxComponent } from './checkbox.component';

const PRY_CHECKBOX_COMPONENTS = [PryCheckboxComponent];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [...PRY_CHECKBOX_COMPONENTS],
  exports: [...PRY_CHECKBOX_COMPONENTS]
})
export class PryCheckboxModule {}
