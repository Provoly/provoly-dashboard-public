import { Component, Input } from '@angular/core';
import { AttributeSimpleValue, Item } from '../../../core/model/item.interface';

@Component({
  selector: 'pry-metadata',
  templateUrl: './metadata.component.html'
})
export class MetadataComponent {
  metadata: { name: string; value: string | number }[] = [];
  id: number;
  opened: boolean = false;
  static idGenerator = 0;

  @Input()
  set item(item: Item | AttributeSimpleValue) {
    this.metadata = [
      ...Object.keys(item?.metadata ?? {}).map((meta) => ({
        name: meta,
        value: (item?.metadata ?? {})[meta]
      }))
    ];
  }

  constructor() {
    this.id = MetadataComponent.idGenerator++;
  }

  toggle() {
    this.opened = !this.opened;
  }
}
