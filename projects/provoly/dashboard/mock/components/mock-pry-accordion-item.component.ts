// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pry-accordion-item',
  template: '<p>Mock Pry accordion item</p>'
})
export class MockPryAccordionItemComponent {
  @Input() item = '';
  @Input() borderColor = '';
  @Input() index!: number;
  @Input() translationStringBase = '';
  @Input() length?: number;

  @Input() showSearchBar: boolean = false;
  @Input() search$ = new BehaviorSubject<any>('');
  @Output() search = new EventEmitter<string>();
}
