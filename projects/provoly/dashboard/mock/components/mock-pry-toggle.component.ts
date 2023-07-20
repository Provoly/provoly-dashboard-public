// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pry-toggle',
  template: '<p>Mock pry toggle</p>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPryToggleComponent),
      multi: true
    }
  ]
})
export class MockPryToggleComponent implements ControlValueAccessor {
  @Input() leftword: any;
  @Input() rightword: any;
  @Input() alwaysActive: any;
  @Input() noMargin: any;
  @Input() notRoundedRight: any;

  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  value: any;

  writeValue(obj: any): void {
    if (obj != this.value) {
      this.value = obj;
      this._onChange(this.value);
      this._onTouched();
    }
  }
}
