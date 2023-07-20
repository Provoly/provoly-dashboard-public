import { BaseNode } from '@provoly/dashboard/pipeline';
import { LiteGraph } from 'litegraph.js';

export class OutputDatasetNode extends BaseNode {
  constructor(title?: string, ...other: any) {
    super();
    this.properties['type'] = 'OutputDataset';
    this.color = OutputDatasetNode.getNodeTitleColor();
    this.titleColor = '#000000';
    this.shape = LiteGraph.BOX_SHAPE;
    this.addInput('items', 'items');
    this.addInput('groups', 'groups');
  }

  static override getNodeTitleColor() {
    return '#7BCCAD';
  }
}
