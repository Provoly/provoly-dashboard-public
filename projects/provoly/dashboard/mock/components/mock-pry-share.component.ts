// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-share',
  template: '<p>pry mock</p>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPryShareComponent),
      multi: true
    }
  ]
})
export class MockPryShareComponent implements ControlValueAccessor {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  _disabled = false;
  @Input() value?: string[];
  @Input() labelProperty = 'label';
  @Input() valueProperty = 'value';
  @Input() disabled = false;
  @Input() users$: Observable<any[]> | null = null;

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
