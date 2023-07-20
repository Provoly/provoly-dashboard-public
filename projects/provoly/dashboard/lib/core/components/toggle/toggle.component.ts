import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextIdValue = 0;

@Component({
  selector: 'pry-toggle',
  templateUrl: './toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryToggleComponent),
      multi: true
    }
  ]
})
export class PryToggleComponent implements ControlValueAccessor {
  @HostBinding('class') class = 'pry-toggle';
  @ViewChild('input') _inputElement!: ElementRef<HTMLInputElement>;

  @Input() alwaysActive = false;
  @Input() disabled = false;
  @Input() mode: 'input' | 'action' = 'input';
  @Input() size: 'normal' | 'sm' = 'normal';
  @Input() dir: 'rtl' | 'ltr' = 'rtl';

  @Input() leftword?: any;
  @Input() rightword?: any;

  onChange: any = () => {};
  onTouch: any = () => {};
  private _checked: boolean = false;
  _id: number;

  get checked(): boolean {
    return this._checked;
  }

  set checked(value: any) {
    this._checked = value != null && `${value}` !== 'false';
    this._cd.markForCheck();
  }

  constructor(private _cd: ChangeDetectorRef) {
    this._id = nextIdValue++;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._cd.markForCheck();
  }

  onChangeValue(event: Event) {
    event.stopPropagation();
    if (this.mode !== 'action') {
      this.checked = this._inputElement.nativeElement.checked;
    }
    this.onChange(this.checked);
    this.onTouch();
  }

  writeValue(value: any) {
    this.checked = !!value;
  }

  onInputClick(event: any): void {
    event.stopPropagation();
    if (this.mode === 'action') {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouch();
    }
  }

  get hasTextInside() {
    return !!this.leftword || !!this.rightword;
  }
}
