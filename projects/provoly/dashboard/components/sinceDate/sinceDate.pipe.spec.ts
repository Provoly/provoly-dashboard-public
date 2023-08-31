import { PryI18nService } from '@provoly/dashboard';
import { PrySinceDatePipe } from './sinceDate.pipe';

describe('SinceDatePipe', () => {
  const pipe = new PrySinceDatePipe({ instant: (x: string) => x } as PryI18nService);
  const testCases = [
    { date: new Date().toString(), string: '@pry.toolbox.now' },
    { date: new Date(new Date().setDate(new Date().getDate() + -1)).toString(), string: '@pry.toolbox.since_day' },
    { date: new Date(new Date().setDate(new Date().getDate() + 3)).toString(), string: '@pry.toolbox.now' },
    { date: new Date(new Date().setDate(new Date().getDate() + -6)).toString(), string: '@pry.toolbox.since_day' },
    {
      date: new Date(new Date().setDate(-40)).toString(),
      string: new Date(new Date().setDate(-40)).toLocaleString()
    },
    { date: '', string: '' },
    { date: 'test', string: '' }
  ];
  testCases.forEach((test) => {
    it(`
      should be ${test.string}
      when date
      is ${new Date(test.date)}`, () => {
      expect(pipe.transform(test.date)).toBe(test.string);
    });
  });

  it(`should display date localized (not as "since") when onlyLocale option is passed`, () => {
    const date = new Date();
    expect(pipe.transform(date.toString(), { onlyLocale: true })).toBe(date.toLocaleString());
  });
});
