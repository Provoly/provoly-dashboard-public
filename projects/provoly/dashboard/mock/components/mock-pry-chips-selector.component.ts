// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pry-chips-selector',
  template: '<p>pry chips selector</p>'
})
export class MockPryChipsSelectorComponent {
  @Input() bindValue = '';
  @Input() bindLabel = '';
  @Input() translationStringBase = '';
  @Input() itemTranslationStringBase = '';
  @Input() showActionButtons: any;
  @Input() usedItems: any;
  @Input() items: any;
  @Input() showSearchbar = true;

  @Output() cancel = new EventEmitter();
  @Output() validated = new EventEmitter();
  @Output() previousTab = new EventEmitter();
  @Output() nextTab = new EventEmitter();
  @Output() itemsChanged = new EventEmitter<any[]>();
}
