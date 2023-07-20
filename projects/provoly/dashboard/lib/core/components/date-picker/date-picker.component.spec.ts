import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { PryDatePickerComponent } from './date-picker.component';
import { DateRangeHighlightPipe } from './date-range-highlight.pipe';

describe('PryDatePickerComponent', () => {
  let component: PryDatePickerComponent;
  let fixture: ComponentFixture<PryDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [
        PryDatePickerComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        DateRangeHighlightPipe,
        MockI18nPipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-01-01'));
    fixture = TestBed.createComponent(PryDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have default input values', () => {
    expect(component.rangePicker).toBe(false);
    expect(component.maxYear).toBe(2032);
    expect(component.minYear).toBe(2032 - 50);
    expect(component.roundSelection).toBe(false);
  });
  it('calculates data for today date correctly', () => {
    expect(component.currentYear.value).toBe(2022);
    expect(component.currentMonth.value).toBe(0);
    component.firstDay.subscribe((day) => expect(day).toBe(6)); //Sunday
    component.dayCount.subscribe((count) => expect(count).toBe(31)); //Sunday
  });
  it('should get get the number of days of the current month in view', () => {
    expect(component.getNumberOfDaysInMonth(2022, 1)).toBe(28);
    expect(component.getNumberOfDaysInMonth(2024, 1)).toBe(29);
  });
  it('should add a leading zero if number is smaller than 10', () => {
    expect(component.addLeadingZero(9)).toBe('09');
    expect(component.addLeadingZero(10)).toBe('10');
  });
  it('should get the date for given day number and current month and year in view', () => {
    expect(component.getDate(25).toDateString()).toBe(new Date('Tue Jan 25 2022 00:00:00 GMT').toDateString());
  });
  it('should set currentYear and currentMonth correctly on goBack', () => {
    component.goBack();
    expect(component.currentYear.value).toBe(2021);
    expect(component.currentMonth.value).toBe(11);
  });
  it('should set currentYear and currentMonth correctly on goForward', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2021-12-31'));
    let fixture2 = TestBed.createComponent(PryDatePickerComponent);
    let component2 = fixture2.componentInstance;
    fixture2.detectChanges();
    component2.goForward();
    expect(component.currentYear.value).toBe(2022);
    expect(component.currentMonth.value).toBe(0);
  });
  it('should set the dateStart correctly when rangePicker is false', () => {
    component.setDateRange(3);
    expect(component.dateRangeStart).toStrictEqual(component.getDate(3));
    expect(component.dateRangeEnd).toBe(null);

    component.setDateRange(8);
    expect(component.dateRangeStart).toStrictEqual(component.getDate(8));
    expect(component.dateRangeEnd).toBe(null);
  });
  it('should set the dateRange when rangePicker is true and dates are chronological', () => {
    component.rangePicker = true;
    component.setDateRange(3);
    expect(component.dateRangeStart).toStrictEqual(component.getDate(3));

    component.setDateRange(8);
    expect(component.dateRangeStart).toStrictEqual(component.getDate(3));
    expect(component.dateRangeEnd).toStrictEqual(component.getDate(8));
  });
  it('should set the dateRange when rangePicker is true and dates are not chronological', () => {
    component.rangePicker = true;
    component.setDateRange(21);
    expect(component.dateRangeStart).toStrictEqual(component.getDate(21));
    expect(component.dateRangeEnd).toBe(null);

    component.setDateRange(14);
    expect(component.dateRangeStart).toStrictEqual(component.getDate(14));
    expect(component.dateRangeEnd).toStrictEqual(component.getDate(21));
  });
  it('should call onClick when one of the date buttons is clicked', () => {
    let button = fixture.debugElement.nativeElement.querySelector('.o-date-picker__days-grid__item');
    const spy = jest.spyOn(component, 'onClick');
    button.click();
    expect(spy).toHaveBeenCalled();
  });
  it('should writeValue to startDateRange when passed a string or date', () => {
    component.writeValue('2022-03-10');
    expect(component.dateRangeStart).toStrictEqual(new Date('2022-03-10'));
    component.writeValue(new Date('2002-12-10'));
    expect(component.dateRangeStart).toStrictEqual(new Date('2002-12-10'));
  });
  it('should writeValue to startDateRange and endDateRange when passed a DateRange obj', () => {
    component.writeValue({ start: '2022-03-10', end: '2022-04-25' });
    expect(component.dateRangeStart).toStrictEqual(new Date('2022-03-10'));
    expect(component.dateRangeEnd).toStrictEqual(new Date('2022-04-25'));
  });
  it('emits date range or string based on dateRangeStart and dateRangeStartEnd', () => {
    component.rangePicker = true;
    component.setDateRange(5);
    component.setDateRange(25);
    component.emitDateRange();
    component.setDateRange(5);
    component.setDateRange(5);
    component.emitDateRange();
  });
  it('should set disabled on setDisabledState()', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });
  it('should set touched on registerOnTouched()', () => {
    component.registerOnTouched(true);
    expect(component.touched).toBe(true);
  });
});
