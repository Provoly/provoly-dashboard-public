import { NgModule } from '@angular/core';
import { PryPaginatorComponent } from './paginator.component';
import { PryIconModule } from '@provoly/dashboard';
import { NgTemplateOutlet } from '@angular/common';
import { PryPaginatorCssComponent } from './style/css.component';

@NgModule({
  declarations: [PryPaginatorComponent, PryPaginatorCssComponent],
  imports: [PryIconModule, NgTemplateOutlet],
  exports: [PryPaginatorComponent, PryPaginatorCssComponent]
})
export class PryPaginatorModule {}
