import { BaseNode } from '@provoly/dashboard/pipeline';

export class NoopNode extends BaseNode {
  constructor(title?: string, ...other: any) {
    super();
    this.properties['type'] = 'No op';
    this.addInput('items', 'items');
    this.addOutput('items', 'items');
  }
}
