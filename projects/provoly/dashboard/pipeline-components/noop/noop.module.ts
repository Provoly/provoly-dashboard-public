import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryCoreModule, PryDashboardModule, PryI18nModule, PrySelectModule } from '@provoly/dashboard';
import { PipelineComponentFactoryService } from '@provoly/dashboard/pipeline';
import { NoopComponent } from './component/noop.component';
import { NoopNode } from './node-class/noop-node.class';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    PryCoreModule,
    PryDashboardModule,
    PrySelectModule,
    PryI18nModule
  ],
  declarations: [NoopComponent],
  exports: [NoopComponent]
})
export class PryPipelineNoopModule {
  constructor(pipelineComponentFactoryService: PipelineComponentFactoryService) {
    pipelineComponentFactoryService.addType('com.onepoint.pry.common.transfo.NoOp', NoopComponent, NoopNode);
  }
}
