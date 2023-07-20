import { BaseNode } from '@provoly/dashboard/pipeline';

export class FilterNode extends BaseNode {
  constructor(title?: string, ...other: any) {
    super();
    this.properties['type'] = 'com.onepoint.pry.common.transfo.Filter';
    this.addInput('items', 'items');
    this.addOutput('items', 'items');
  }
}
