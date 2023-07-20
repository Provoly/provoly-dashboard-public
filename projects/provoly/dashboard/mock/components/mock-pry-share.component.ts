// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { PryVisibility } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-share',
  template: '<p>pry mock</p>'
})
export class MockPryShareComponent implements ControlValueAccessor {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  _disabled = false;
  @Input() value?: PryVisibility;
  @Input() labelProperty = 'label';
  @Input() valueProperty = 'value';
  @Input() disabled = false;
  @Input() users$: Observable<any[]> | null = null;
  visibilityTypes: { label: string; value: string; icon: string }[] = [];

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
