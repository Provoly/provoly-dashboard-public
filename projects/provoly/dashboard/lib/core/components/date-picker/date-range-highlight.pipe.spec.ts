import { DateRangeHighlightPipe } from './date-range-highlight.pipe';

describe('DateRangeHighlightPipe', () => {
  const pipe = new DateRangeHighlightPipe();
  const date1 = new Date(2022, 0, 1); // 1st of Jan
  const date2 = new Date(2022, 1, 3); // 3rd of Feb

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return empty string', () => {
    expect(pipe.transform(0, 0, 2022, null, null)).toBe('');
  });
  it('should return -selected class name if start and null end', () => {
    expect(pipe.transform(0, 0, 2022, date1, null)).toBe('-selected');
  });
  it('should return -selected class name if start === end', () => {
    expect(pipe.transform(0, 0, 2022, date1, date1)).toBe('-selected');
  });
  it('should return -start class name', () => {
    expect(pipe.transform(0, 0, 2022, date1, date2)).toBe('-start');
  });
  it('should return -in-range class name', () => {
    expect(pipe.transform(26, 0, 2022, date1, date2)).toBe('-in-range');
  });
  it('should return -end class name', () => {
    expect(pipe.transform(2, 1, 2022, date1, date2)).toBe('-end');
  });
});
