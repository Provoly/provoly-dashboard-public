import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let uniqueId = 0;

@Component({
  selector: 'pry-range',
  templateUrl: './range.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryRangeComponent),
      multi: true
    }
  ]
})
export class PryRangeComponent implements ControlValueAccessor, DoCheck {
  @Input() min: string = '0';
  @Input() max: string = '100';
  @Input() step: string = '1';
  @Input() disabled = false;

  @Input() labelTranslate?: string;
  @ViewChild('input') input!: ElementRef;

  private _value = '';
  id: number;

  info: { left: number; text: string; backgroundSize: number } = {
    left: 0,
    text: this._value,
    backgroundSize: 100
  };

  get value(): string {
    return this._value;
  }

  set value(newValue: string) {
    this._value = newValue;
  }

  constructor(private _cd: ChangeDetectorRef) {
    this.id = uniqueId++;
  }

  onChange: any = (_: any) => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cd.markForCheck();
  }

  writeValue(obj: string): void {
    if (obj) {
      this.value = obj;
      this.updateView();
      this.onChange(this.value);
      this._cd.markForCheck();
    }
  }

  private updateView() {
    this.info = {
      left: this.getLeftPosition(),
      text: this.value,
      backgroundSize: this.getBackgroundSize(this.value)
    };
  }

  writeValueEvent($event: Event) {
    this.writeValue(($event.target as HTMLInputElement).value);
  }

  getBackgroundSize(currentValue: string) {
    return ((parseInt(currentValue) - parseInt(this.min)) * 100) / (parseInt(this.max) - parseInt(this.min));
  }

  getLeftPosition() {
    if (this.input) {
      let width = this.input.nativeElement.offsetWidth;
      return (
        ((parseInt(this.value) - parseInt(this.min)) / (parseInt(this.max) - parseInt(this.min))) * (width - 22) + 11
      );
    }
    return 50;
  }

  @HostListener('window:resize')
  ngDoCheck() {
    this.updateView();
  }
}
