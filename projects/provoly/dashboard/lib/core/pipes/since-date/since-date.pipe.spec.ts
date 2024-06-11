import { PryI18nService } from '@provoly/dashboard';
import { SinceDatePipe } from './since-date.pipe';

const DAYS_IN_MS = 24 * 3600 * 1000;

describe('SinceDatePipe', () => {
  const mockI18nService = { instant: (x: string, params) => `${x}|${JSON.stringify(params)}` } as PryI18nService;

  const today = new Date();
  today.setHours(9, 7, 28, 0);

  const yesterday = new Date();
  yesterday.setTime(today.getTime() - 24 * 60 * 60 * 1000);

  const previousMidnightMinus1second = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
    23,
    59,
    59,
    999
  );

  const thisMorningPlusOneMSecond = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 1);

  const testCases = [
    {
      date: today.toString(),
      string: '@pry.toolbox.today|{"hour":"09","min":"07"}',
      now: today,
      label: 'Exact same time should say Today'
    },
    {
      date: thisMorningPlusOneMSecond.toString(),
      string: '@pry.toolbox.today|{"hour":"00","min":"00"}',
      now: today,
      label: 'First moment this morning should say Today'
    },
    {
      date: new Date(today.getTime() + 3 * DAYS_IN_MS).toString(),
      string: '@pry.toolbox.from_day|{"day":3,"plural":"s"}',
      now: today,
      label: '3 days in the future'
    },
    {
      date: new Date(today.getTime() - 6 * DAYS_IN_MS + 1).toString(),
      string: '@pry.toolbox.since_day|{"day":6,"plural":"s"}',
      now: today,
      label: '6 days ago'
    },
    {
      date: new Date(today.getTime() - 40 * DAYS_IN_MS).toString(),
      string: new Date(today.getTime() - 40 * DAYS_IN_MS).toLocaleString(),
      now: today,
      label: '40 days ago'
    },
    { date: '', string: '', now: today, label: 'No date value' },
    { date: 'test', string: '', now: today, label: 'invalid Date value' },
    {
      date: previousMidnightMinus1second.toString(),
      string: '@pry.toolbox.since_day|{"day":1,"plural":""}',
      now: today,
      label: 'Last yesterday second'
    }
  ];

  testCases.forEach((test) => {
    it(`${test.label}`, () => {
      const pipe = new SinceDatePipe(mockI18nService);
      expect(pipe.useNow(test.now).transform(test.date)).toBe(test.string);
    });
  });

  it(`should display date localized (not as "since") when onlyLocale option is passed`, () => {
    const date = new Date();
    const pipe = new SinceDatePipe(mockI18nService);
    expect(pipe.transform(date.toString(), { onlyLocale: true })).toBe(date.toLocaleString());
  });
});
