import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryIconComponent } from './icon.component';

const PRY_ICON_COMPONENTS = [PryIconComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...PRY_ICON_COMPONENTS],
  exports: [...PRY_ICON_COMPONENTS]
})
export class PryIconModule {}
