import { PryI18nService } from '@provoly/dashboard';
import { FormatNumberPipe } from '../expand-value/format-number.pipe';

describe('FormatNumberPipe', () => {
  let component: FormatNumberPipe;

  // @TODO add/rework tests when field formatting is implemented

  beforeEach(async () => {
    component = new FormatNumberPipe({
      instant: (arg: string) => (arg === '@pry.format.thousands' ? '|' : '$')
    } as PryI18nService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
