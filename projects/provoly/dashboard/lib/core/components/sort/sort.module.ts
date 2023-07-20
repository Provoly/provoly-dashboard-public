import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryIconModule } from '../icon/icon.module';
import { PrySortDataPipe } from './sort-data.pipe';
import { PrySortHeaderDirective } from './sort-header.directive';
import { PrySortHeaderComponent } from './sort-header/sort-header.component';
import { PrySortTableDirective } from './sort-table.directive';

const PRY_SORT_COMPONENTS = [PrySortHeaderComponent, PrySortHeaderDirective, PrySortTableDirective, PrySortDataPipe];

@NgModule({
  declarations: [...PRY_SORT_COMPONENTS],
  exports: [...PRY_SORT_COMPONENTS],
  imports: [CommonModule, PryIconModule]
})
export class PrySortModule {}
