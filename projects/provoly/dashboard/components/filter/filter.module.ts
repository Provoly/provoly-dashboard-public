import { NgModule } from '@angular/core';
import { PryFilterPipe } from './filter.pipe';

@NgModule({
  declarations: [PryFilterPipe],
  exports: [PryFilterPipe]
})
export class PryFilterModule {}
