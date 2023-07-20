import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let uniqueId = 0;

@Component({
  selector: 'pry-select',
  templateUrl: './select.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrySelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrySelectComponent implements ControlValueAccessor {
  public id: number = uniqueId++;

  @Input() labelTranslate = false;
  @Input() baseTranslate = '';
  @Input() translationFn?: (...args: any[]) => any;
  @Input() translationFnArgs: any[] = [];
  @Input() clearable = false;
  @Input() multiple = false;
  @Input() multipleClearRight = false;

  @Input() placeholder?: string;
  @Input() isForm = false;
  @Input() required?: any;
  @Input() name?: any;
  @Input() readonly = false;

  get disabled(): boolean {
    return this._disabled;
  }

  @Input() items!: any[] | null;
  @Input() itemsAsOption = false;
  @Input() bindData = false;
  @Input() bindValue: any;
  @Input() bindLabel: any;
  @Input() bindIcon: any;
  @Input() iconSize = [14, 14];

  @Input() templateLabel?: TemplateRef<any>;
  @Input() templateOption?: TemplateRef<any>;

  @Input() autocomplete: boolean = false;

  value: any;

  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  private _disabled = false;

  constructor(private _cd: ChangeDetectorRef) {}

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this._cd.markForCheck();
  }

  writeValue(obj: any): void {
    if (this.value !== obj) {
      this.value = obj;
      this._onChange(this.value);
      this._onTouched();
      this._cd.markForCheck();
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.countryName.toLocaleLowerCase().indexOf(term) > -1;
  }
}
