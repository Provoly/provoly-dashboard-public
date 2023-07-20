import { NgModule } from '@angular/core';
import { PrySinceDatePipe } from './sinceDate.pipe';

@NgModule({
  declarations: [PrySinceDatePipe],
  exports: [PrySinceDatePipe]
})
export class PrySinceDateModule {}
