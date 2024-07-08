import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PUBLIC_GROUP } from '../share.utils';

@Component({
  selector: 'pry-share',
  templateUrl: './share.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryShareComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryShareComponent implements ControlValueAccessor {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  _disabled = false;
  value: string[] = [];
  stringValue: 'PRIVATE' | 'PUBLIC' = 'PRIVATE';
  @Input() labelProperty = 'label';
  @Input() valueProperty = 'value';
  visibilityTypes: { name: string; icon: string }[] = [
    { name: 'PUBLIC', icon: 'public' },
    { name: 'PRIVATE', icon: 'private' }
  ];

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

  writeValue(value: string[]) {
    if (value) {
      this.value = value;
      this.stringValue = value.length > 0 ? 'PUBLIC' : 'PRIVATE';
      this._onChange(this.value);
      this._onTouched();
      this._cd.markForCheck();
    }
  }

  onChange($event: string) {
    this.value = $event === 'PUBLIC' ? [PUBLIC_GROUP] : [];
    this.writeValue(this.value);
    this._onTouched();
    this._cd.markForCheck();
  }
}
