import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'pry-time-picker',
  templateUrl: './time-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryTimePickerComponent),
      multi: true
    }
  ]
})
export class PryTimePickerComponent implements ControlValueAccessor, OnInit {
  HOURS = Array.from(Array(24).keys()).map((hour) => hour.toString().padStart(2, '0'));
  MINUTES = Array.from(Array(60).keys()).map((min) => min.toString().padStart(2, '0'));
  @Input() AMPMFormat: boolean = false;
  selectedHour = new BehaviorSubject(new Date().getHours().toString().padStart(2, '0'));
  selectedMinute = new BehaviorSubject(new Date().getMinutes().toString().padStart(2, '0'));
  time = this.selectedHour + ':' + this.selectedHour + ':00';
  @ViewChild('hourInput') hourInput?: ElementRef;
  @ViewChild('minuteInput') minuteInput?: ElementRef;

  onChange = (time: string) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  ngOnInit(): void {
    this.onChange(this.time);
  }

  writeValue(time: string | null): void {
    if (time) {
      this.selectedHour.next(new Date('1970-01-01T' + time).getHours().toString().padStart(2, '0'));
      this.selectedMinute.next(new Date('1970-01-01T' + time).getMinutes().toString().padStart(2, '0'));
    }
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  selectHour(event: string): void {
    this.markAsTouched();
    this.selectedHour.next(event);
    this.onChange(this.getTimeFormatted());
  }

  selectMinute(event: string): void {
    this.markAsTouched();
    this.selectedMinute.next(event);
    this.onChange(this.getTimeFormatted());
  }

  getTimeFormatted(): string {
    return this.selectedHour.value + ':' + this.selectedMinute.value + ':00';
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
