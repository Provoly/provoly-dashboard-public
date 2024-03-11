// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PryVisibility } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-group-share',
  template: '<p>pry mock</p>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPryGroupShareComponent),
      multi: true
    }
  ]
})
export class MockPryGroupShareComponent implements ControlValueAccessor {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  @Input() disableRadios = false;
  @Input() allowedGroups = [];

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
