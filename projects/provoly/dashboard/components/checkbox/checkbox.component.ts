import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pry-checkbox',
  templateUrl: './checkbox.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryCheckboxComponent),
      multi: true
    }
  ]
})
export class PryCheckboxComponent implements ControlValueAccessor, AfterViewInit {
  @Input() circle = true;
  onChange: any = () => {};
  onTouch: any = () => {};
  checked = false;
  disabled = false;
  inhibate = true;

  constructor(private _cd: ChangeDetectorRef) {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Define what should happen in this component, if something changes outside
  writeValue(checked: boolean) {
    if (this.checked !== checked && !this.inhibate) {
      this.checked = checked;
      this.onChange(this.checked);
      this.onTouch();
      this._cd.detectChanges();
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.inhibate = false;
  }
}
