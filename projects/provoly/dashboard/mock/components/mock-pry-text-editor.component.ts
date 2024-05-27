// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pry-text-editor',
  template: '<p>Mock text editor/p>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPryTextEditorComponent),
      multi: true
    }
  ]
})
export class MockPryTextEditorComponent {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  _disabled = false;
  @Input() tabView = true;

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {}
}
