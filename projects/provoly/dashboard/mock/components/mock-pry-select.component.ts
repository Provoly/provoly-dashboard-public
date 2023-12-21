// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, forwardRef, Input, Output, TemplateRef } from '@angular/core';
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

  @Input() items: any[] | null | undefined = null;
  @Input() clearable = false;
  @Input() multiple = false;
  @Input() closeOnSelect = true;
  @Input() placeholder?: string;
  @Input() isForm = false;
  @Input() required?: any;
  @Input() name?: any;
  @Input() readonly = false;
  @Input() autocomplete: boolean = false;
  @Input() bindValue: string | undefined;
  @Input() bindLabel: string | undefined;
  @Input() iconSize = [14, 14];
  @Input() bindIcon: any;
  @Input() template?: TemplateRef<any>;
  @Input() i18nPrefix: string | null = null;
  @Output() searched = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();
}
