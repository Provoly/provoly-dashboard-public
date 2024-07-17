import { DataFormatPipe, LOCALE } from './data-format.pipe';

describe('DataFormatPipe', () => {
  const pipe = new DataFormatPipe();

  afterEach(() => {
    LOCALE.value = 'en-US';
  });

  it('should return the same value if no arguments are passed', () => {
    expect(pipe.transform(123)).toBe(123);
  });

  describe('numbers', () => {
    it('should format number to locale format (us)', () => {
      expect(pipe.transform(123456, { localeFormat: true })).toBe('123,456');
    });
    it('should format number to locale format (fr)', () => {
      LOCALE.value = 'fr-FR';
      expect(pipe.transform(123456, { localeFormat: true })).toBe('123 456');
    });
    it('should add suffix', () => {
      expect(pipe.transform(123456, { unit: 'km' })).toBe('123456 km');
    });
    it('should format to locale and add suffix', () => {
      expect(pipe.transform(123456, { localeFormat: true, unit: 'km' })).toBe('123,456 km');
    });
  });

  describe('floats', () => {
    it('should format float to locale format (us)', () => {
      expect(pipe.transform(123456.234, { localeFormat: true })).toBe('123,456.234');
    });
    it('should format number to locale format (fr)', () => {
      LOCALE.value = 'fr-FR';
      expect(pipe.transform(123456.234, { localeFormat: true })).toBe('123 456,234');
    });
    it('should add suffix', () => {
      expect(pipe.transform(123.456, { unit: 'km' })).toBe('123.456 km');
    });
    it('should apply decimal precision', () => {
      expect(pipe.transform(123.456888, { decimalPrecision: 3 })).toBe('123.457');
    });
    it('should apply decimal precision', () => {
      expect(pipe.transform(123.1, { decimalPrecision: 3 })).toBe('123.100');
    });
    it('should apply decimal precision', () => {
      expect(pipe.transform(123, { decimalPrecision: 3 })).toBe('123.000');
    });
    it('should format to locale and add suffix', () => {
      expect(pipe.transform(123456.234, { localeFormat: true, unit: 'km' })).toBe('123,456.234 km');
    });
    it('should apply precision, format to locale and add suffix', () => {
      expect(pipe.transform(123456.288, { localeFormat: true, unit: 'km', decimalPrecision: 1 })).toBe('123,456.3 km');
    });
    it('should apply precision, but not locale', () => {
      LOCALE.value = 'fr-FR';
      expect(pipe.transform(123456.288, { localeFormat: false, decimalPrecision: 1 })).toBe('123456,3');
    });
  });

  describe('dates', () => {
    const date = '2021-02-03T00:00:00.000Z';
    // ignoring TZ instanciation problems since not related to format
    const cases = [
      { format: 'DATETIME', expected: new RegExp('03/02/2021 [0-9]+:[0-9][0-9]'), locale: 'fr-FR' },
      { format: 'DATETIME', expected: new RegExp('2/3/2021, [0-9]+:[0-9][0-9] AM'), locale: 'en-US' },
      { format: 'DATE', expected: '03/02/2021', locale: 'fr-FR' },
      { format: 'DATE', expected: '02/03/2021', locale: 'en-US' },
      { format: 'MONTH_YEAR', expected: '02/2021', locale: 'fr-FR' },
      { format: 'DAY_MONTH', expected: '03/02', locale: 'fr-FR' },
      { format: 'YEAR', expected: '2021', locale: 'fr-FR' },
      { format: 'MONTH', expected: '02', locale: 'fr-FR' },
      { format: 'DAY', expected: '03', locale: 'fr-FR' }
    ];

    it('should format date to expected format', () => {
      cases.forEach(({ format, expected, locale }) => {
        LOCALE.value = locale;
        expect(pipe.transform(date, { format: format })).toMatch(expected);
      });
    });
  });

  describe('other cases', () => {
    it('should return undefined if value is undefined', () => {
      expect(pipe.transform(undefined)).toBeUndefined();
    });
    it('should return undefined if value is undefined even if format options are provided', () => {
      expect(pipe.transform(undefined, { unit: 'unit' })).toBeUndefined();
    });
    it('should return undefined if value is null', () => {
      expect(pipe.transform(null)).toBeNull();
    });
    it('should return undefined if value is null even if format options are provided', () => {
      expect(pipe.transform(null, { unit: 'unit' })).toBeNull();
    });
  });
});
