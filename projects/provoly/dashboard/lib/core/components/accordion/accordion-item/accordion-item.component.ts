import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pry-accordion-item',
  templateUrl: './accordion-item.component.html'
})
export class AccordionItemComponent {
  @Input() item = '';
  @Input() borderColor = '';
  @Input() index!: number;
  @Input() translationStringBase = '';
  @Input() length?: number;

  @Input() showSearchBar: boolean = false;
  @Input() search$!: BehaviorSubject<any>;
  @Output() search = new EventEmitter<string>();

  constructor() {}

  onSearch(item: string, $event: any) {
    this.search.emit({ ...this.search$.getValue(), [item]: $event });
  }
}
