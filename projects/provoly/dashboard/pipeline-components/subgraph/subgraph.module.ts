import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryCoreModule, PryDashboardModule, PryI18nModule, PrySelectModule } from '@provoly/dashboard';
import { PipelineComponentFactoryService } from '@provoly/dashboard/pipeline';
import { EmptyComponent } from './component/empty.component';
import { SubGraphInput } from './node-class/sub-graph-input.class';
import { SubGraphNode } from './node-class/sub-graph-node.class';
import { SubGraphOutput } from './node-class/sub-graph-output.class';

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
  declarations: [EmptyComponent],
  exports: [EmptyComponent]
})
export class PryPipelineSubgraphModule {
  constructor(pipelineComponentFactoryService: PipelineComponentFactoryService) {
    pipelineComponentFactoryService.addType('SubGraphNode', EmptyComponent, SubGraphNode);
    pipelineComponentFactoryService.addType('SubGraphInput', EmptyComponent, SubGraphInput, 'operation', '', false);
    pipelineComponentFactoryService.addType('SubGraphOutput', EmptyComponent, SubGraphOutput, 'operation', '', false);
  }
}
