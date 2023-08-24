import { BaseNode } from '@provoly/dashboard/pipeline';

export class FilterNode extends BaseNode {
  constructor(title?: string, ...other: any) {
    super();
    this.properties['type'] = 'com.provoly.common.transfo.Filter';
    this.addInput('items', 'items');
    this.addOutput('items', 'items');
  }
}
