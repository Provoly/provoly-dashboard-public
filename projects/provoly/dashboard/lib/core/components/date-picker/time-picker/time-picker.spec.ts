import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoopScrollColumnComponent } from './loop-scroll-column/loop-scroll-column.component';
import { PryTimePickerComponent } from './time-picker.component';

describe('PryTimePickerComponent', () => {
  let component: PryTimePickerComponent;
  let fixture: ComponentFixture<PryTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [PryTimePickerComponent, LoopScrollColumnComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2022-01-01T13:01:00'));
    fixture = TestBed.createComponent(PryTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should select hour', () => {
    component.selectHour('20');
    expect(component.selectedHour.value).toBe('20');
    component.selectHour('00');
    expect(component.selectedHour.value).toBe('00');
  });
  it('should select minute', () => {
    component.selectMinute('55');
    expect(component.selectedMinute.value).toBe('55');
    component.selectMinute('00');
    expect(component.selectedMinute.value).toBe('00');
  });
  it('change hour and minute on write value', () => {
    component.writeValue(null);
    expect(component.selectedHour.value).toBe('13');
    expect(component.selectedMinute.value).toBe('01');
    component.writeValue('22:44:21');
    expect(component.selectedHour.value).toBe('22');
    expect(component.selectedMinute.value).toBe('44');
  });
  it('register on touched', () => {
    component.selectHour('12');
    expect(component.touched).toBe(true);
  });
  it('register on touched', () => {
    component.selectHour('12');
    expect(component.touched).toBe(true);
  });
});
