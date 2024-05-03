import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import equal from 'fast-deep-equal/es6';
import { Observable } from 'rxjs';
import { PryVisibility, PryVisibilityType } from '../share.model';

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
export class PryShareComponent implements ControlValueAccessor, OnInit {
  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  _disabled = false;
  PryVisibilityType = PryVisibilityType;
  @Input() value?: PryVisibility;
  @Input() labelProperty = 'label';
  @Input() valueProperty = 'value';
  @Input() users$: Observable<any[]> | null = null;
  visibilityTypes: { label: string; value: string; icon: string }[] = [];

  constructor(private _cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.visibilityTypes = Object.keys(PryVisibilityType)
      .filter((x) => !(parseInt(x) >= 0))
      .filter((x) => (!this.users$ ? x !== PryVisibilityType.RESTRICTED : true))
      .map((label) => ({ label: label.toLowerCase(), value: label, icon: `${label.toLowerCase()}` }));
  }

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

  writeValueUsers(obj: any[]): void {
    if (!equal(this.value?.users, obj)) {
      this.writeValue({ type: this.value?.type, users: obj });
    }
  }

  writeValueType(type: PryVisibilityType): void {
    if (this.value?.type !== type) {
      this.writeValue({ type, users: this.value?.users });
    }
  }

  writeValue(obj: any) {
    if (!equal(this.value, obj)) {
      this.value = obj;
      this._onChange(this.value);
      this._onTouched();
      this._cd.markForCheck();
    }
  }
}
