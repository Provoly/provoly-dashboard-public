import { BaseNode } from '@provoly/dashboard/pipeline';
import { v4 } from 'uuid';

export class SubGraphInput extends BaseNode {
  constructor(title?: string, ...other: any) {
    super();
    this.properties['id'] = v4();
    this.title = title ?? '';
    this.color = '#a7f6fd';
    this.titleColor = '#000000';
    const offset = parseInt(title?.split('-')[title?.split('-').length - 1] ?? '1', 10) + 1;
    this.pos = [50, offset * 100];
    this.addOutput('items', 'items');
  }
}
