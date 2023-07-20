import { DecimalPipe } from '@angular/common';
import { PryI18nService } from '@provoly/dashboard';
import { MockDecimalPipe } from '../../../mock/pipe/mock-decimal.pipe';
import { FormatNumberPipe } from '../expand-value/format-number.pipe';

describe('FormatNumberPipe', () => {
  let component: FormatNumberPipe;

  beforeEach(async () => {
    component = new FormatNumberPipe(
      new MockDecimalPipe() as DecimalPipe,
      {
        instant: (arg: string) => (arg === '@pry.format.thousands' ? '|' : '$')
      } as PryI18nService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take value to display into account', () => {
    expect(component.transform(6)).toEqual({ isNumber: true, text: '6' });
  });

  it('should manage thousands', () => {
    expect(component.transform(6000000)).toEqual({ isNumber: true, text: '6|000|000' });
  });

  it('should ignore stars', () => {
    expect(component.transform('***')).toEqual({ isNumber: false, text: '***' });
  });

  it('should manage comma', () => {
    expect(component.transform(6.3)).toEqual({ isNumber: true, text: '6$3' });
  });
});
