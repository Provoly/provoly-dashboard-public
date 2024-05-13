// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pry-checkbox',
  template: '<p>pry selector</p>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPryCheckboxComponent),
      multi: true
    }
  ]
})
export class MockPryCheckboxComponent {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  _disabled = false;
  @Input() value: any;
  @Output() valueChanged?: EventEmitter<any>;

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
