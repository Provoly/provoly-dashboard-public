import { BaseNode } from '@provoly/dashboard/pipeline';
import { LiteGraph } from 'litegraph.js';

export class InputDatasourceNode extends BaseNode {
  constructor(title?: string, ...other: any) {
    super();
    this.properties['type'] = 'com.onepoint.pry.common.transfo.InputDatasource';
    this.color = InputDatasourceNode.getNodeTitleColor();
    this.titleColor = '#000000';
    this.shape = LiteGraph.BOX_SHAPE;
    this.addOutput('items', 'items');
  }

  static override getNodeTitleColor() {
    return '#FFC971';
  }
}
