import { NgModule } from '@angular/core';
import { DataFormatPipe } from './data-format.pipe';

@NgModule({
  declarations: [DataFormatPipe],
  exports: [DataFormatPipe]
})
export class PryDataFormatModule {}
