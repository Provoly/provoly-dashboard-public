import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

export interface DateRange {
  start: string;
  end?: string;
}

@Component({
  selector: 'pry-date-picker',
  templateUrl: './date-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryDatePickerComponent),
      multi: true
    }
  ]
})
export class PryDatePickerComponent implements ControlValueAccessor {
  TODAY = new Date();
  WEEKDAYS = [...Array(7).keys()];
  MONTHS = [...Array(12).keys()];
  @Input() rangePicker: boolean = false;
  @Input() timePicker: boolean = false;
  @Input() maxYear: number = this.TODAY.getFullYear() + 10;
  @Input() minYear: number = this.maxYear - 50;
  @Input() roundSelection: boolean = false;
  YEARS = [...Array(this.maxYear + 1).keys()].filter((year) => year >= this.minYear).reverse();
  onChange = (date: string | Date | DateRange) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  currentYear = new BehaviorSubject(this.TODAY.getFullYear());
  currentMonth = new BehaviorSubject(this.TODAY.getMonth());
  dayCount = combineLatest([this.currentYear, this.currentMonth]).pipe(
    map(([year, month]) => this.getNumberOfDaysInMonth(year, month))
  );
  DAY$ = this.dayCount.pipe(map((count) => (count ? [...Array(count).keys()] : [])));
  firstDay = combineLatest([this.currentYear, this.currentMonth]).pipe(
    map(([year, month]) => new Date(year, month, 1).getDay())
  );
  dateRangeStart: null | Date = null;
  dateRangeEnd: null | Date = null;
  time = new BehaviorSubject(
    `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}:00`
  );

  writeValue(obj: string | Date | DateRange | null) {
    if (
      obj == null ||
      obj == '' ||
      (this.dateRangeStart
        ? this.dateRangeStart > new Date(this.maxYear + 1, 0, 1) || this.dateRangeStart < new Date(this.minYear, 0, 1)
        : false)
    ) {
      return;
    } else if (typeof obj === 'string') {
      this.dateRangeStart = !isNaN(new Date(obj).getTime()) ? new Date(obj) : null;
    } else if (obj instanceof Date) {
      this.dateRangeStart = !isNaN(new Date(obj).getTime()) ? obj : null;
    } else {
      this.dateRangeStart = obj.start ? new Date(obj.start) : null;
      this.dateRangeEnd = obj.end ? new Date(obj.end) : null;
    }
    if (this.timePicker && this.dateRangeStart && !this.rangePicker) {
      this.time.next(
        `${this.dateRangeStart.getHours().toString().padStart(2, '0')}:${this.dateRangeStart
          .getMinutes()
          .toString()
          .padStart(2, '0')}:00`
      );
    }
    if (obj && this.dateRangeEnd) {
      this.currentYear.next(this.dateRangeEnd.getFullYear());
      this.currentMonth.next(this.dateRangeEnd.getMonth());
    } else if (obj && this.dateRangeStart) {
      this.currentYear.next(this.dateRangeStart.getFullYear());
      this.currentMonth.next(this.dateRangeStart.getMonth());
    }
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
    if (this.dateRangeEnd) {
      this.currentYear.next(this.dateRangeEnd.getFullYear());
      this.currentMonth.next(this.dateRangeEnd.getMonth());
    } else if (this.dateRangeStart) {
      this.currentYear.next(this.dateRangeStart.getFullYear());
      this.currentMonth.next(this.dateRangeStart.getMonth());
      if (this.timePicker) {
        this.time.next(
          `${this.dateRangeStart.getHours().toString().padStart(2, '0')}:${this.dateRangeStart
            .getMinutes()
            .toString()
            .padStart(2, '0')}:00`
        );
      }
    }
  }

  registerOnTouched(onTouched: any): void {
    this.touched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getNumberOfDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  addLeadingZero(number: number): string {
    return number > 9 ? number.toString() : '0' + number.toString();
  }

  getDate(day: number) {
    let date = new Date(this.currentYear.value, this.currentMonth.value, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  changeMonth(e: number) {
    this.currentMonth.next(e);
  }

  changeYear(e: number) {
    this.currentYear.next(e);
  }

  goBack() {
    if (this.currentMonth.value - 1 < 0) {
      this.currentYear.next(this.currentYear.value - 1);
      this.currentMonth.next(11);
    } else {
      this.currentMonth.next(this.currentMonth.value - 1);
    }
  }

  goForward() {
    if (this.currentMonth.value + 1 > 11) {
      this.currentYear.next(this.currentYear.value + 1);
      this.currentMonth.next(0);
    } else {
      this.currentMonth.next(this.currentMonth.value + 1);
    }
  }

  onClick() {
    this.onTouched();
    this.emitDateRange();
  }

  setTime($event: string) {
    this.time.next($event);
  }

  setDateRange(day: number) {
    let selectedDate = this.getDate(day);
    if (!this.dateRangeStart || this.dateRangeStart.getTime() === selectedDate.getTime()) {
      this.dateRangeStart = selectedDate;
    } else if (!this.dateRangeEnd && this.rangePicker) {
      if (selectedDate < this.dateRangeStart) {
        this.dateRangeEnd = this.dateRangeStart;
        this.dateRangeStart = selectedDate;
      } else {
        this.dateRangeEnd = selectedDate;
      }
    } else {
      this.dateRangeStart = selectedDate;
      this.dateRangeEnd = null;
    }
  }

  emitDateRange() {
    let start = this.dateRangeStart
      ? this.dateRangeStart.getFullYear().toString() +
        '-' +
        this.addLeadingZero(this.dateRangeStart.getMonth() + 1) +
        '-' +
        this.addLeadingZero(this.dateRangeStart.getDate())
      : '';
    let end = this.dateRangeEnd
      ? this.dateRangeEnd.getFullYear().toString() +
        '-' +
        this.addLeadingZero(this.dateRangeEnd.getMonth() + 1) +
        '-' +
        this.addLeadingZero(this.dateRangeEnd.getDate())
      : null;

    if (this.rangePicker && end) {
      this.onChange({ start, end });
    } else if (this.timePicker && start) {
      this.onChange(start + 'T' + this.time.value);
    } else if (start) {
      this.onChange(start);
    }
  }
}
