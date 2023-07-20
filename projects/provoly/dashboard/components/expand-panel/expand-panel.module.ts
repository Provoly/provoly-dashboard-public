import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryExpandPanelComponent, PryExpansionPanelTitleDirective } from './expand-panel.component';

const PRY_EXPAND_PANEL_COMPONENTS = [PryExpandPanelComponent, PryExpansionPanelTitleDirective];

@NgModule({
  declarations: [...PRY_EXPAND_PANEL_COMPONENTS],
  exports: [...PRY_EXPAND_PANEL_COMPONENTS],
  providers: [DecimalPipe]
})
export class PryExpandPanelModule {}
