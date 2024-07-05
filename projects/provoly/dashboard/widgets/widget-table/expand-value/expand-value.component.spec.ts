import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PryI18nService } from '@provoly/dashboard';

import { ExpandValueComponent } from './expand-value.component';
import { MockDataFormatPipe } from '@provoly/dashboard/mock/pipe/mock-data-format.pipe';

describe('ExpandValueComponent', () => {
  let component: ExpandValueComponent;
  let fixture: ComponentFixture<ExpandValueComponent>;
  PryI18nService.warn = false;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpandValueComponent, MockDataFormatPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take array of values to display into account', () => {
    component.value = [3, 4, 5, '***'];
    fixture.detectChanges();
    expect(component.firstValue).toEqual(3);
    expect(component.rest).toEqual([4, 5, '***']);
    expect(component.isArray).toEqual(true);
  });

  it('should take value to display into account', () => {
    component.value = 6;
    fixture.detectChanges();
    expect(component.firstValue).toEqual(6);
    expect(component.rest).toEqual([]);
    expect(component.isArray).toEqual(false);
  });

  it('should take value to display into account', () => {
    component.value = 60000000;
    fixture.detectChanges();
    expect(component.firstValue).toEqual(60000000);
    expect(component.rest).toEqual([]);
    expect(component.isArray).toEqual(false);
  });
});
