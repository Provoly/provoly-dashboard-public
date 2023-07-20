import { Component, Input } from '@angular/core';
import { BaseNode } from '../node-class/base-node.class';
import { NodeStatusModel } from '../store/pipeline.actions';

@Component({ selector: 'pry-properties-panel', template: '' })
export class PipelinePropertiesPanelComponent {
  @Input() node!: BaseNode;
  @Input() checkFn!: () => void;
  @Input() model?: NodeStatusModel;
  @Input() disabled: boolean = false;
}
