// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, forwardRef, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pry-select',
  template: '<p>pry select</p>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPrySelectComponent),
      multi: true
    }
  ]
})
export class MockPrySelectComponent implements ControlValueAccessor {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(obj: any): void {
    this._onChange(obj);
    this._onTouched();
  }

  @Input() labelTranslate = false;
  @Input() baseTranslate = '';
  @Input() translationFn?: (...args: any[]) => any;
  @Input() translationFnArgs: any[] = [];
  @Input() clearable = false;
  @Input() multiple = false;
  @Input() multipleClearRight = false;

  @Input() items!: any[] | null;
  @Input() itemsAsOption = false;
  @Input() bindData = false;
  @Input() bindValue: any;
  @Input() bindLabel: any;
  @Input() bindIcon: any;
  @Input() autocomplete: any;

  @Input() isForm = false;
  @Input() required?: any;
  @Input() name?: any;
  @Input() readonly = false;
  @Input() placeholder = false;

  @Input() templateLabel?: TemplateRef<any>;
  @Input() templateOption?: TemplateRef<any>;
}
