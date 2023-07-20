import { PrySortDataPipe } from './sort-data.pipe';

interface Mock {
  value?: number;
  type?: string;
  bool?: boolean;
}

describe('SortDataPipe', () => {
  const pipe = new PrySortDataPipe<Mock>();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return empty list', () => {
    expect(pipe.transform([], null, 'asc')).toEqual([]);
  });
  it('should sort number asc', () => {
    const valueA: Mock = { value: 12, type: 'aaa' };
    const valueB: Mock = { value: 3, type: 'bbb' };
    const valueC: Mock = { value: 78, type: 'ccc' };
    const valueD: Mock = { value: -1, type: 'ddd' };
    expect(pipe.transform([valueA, valueB, valueC, valueD], 'value', 'asc')).toEqual([valueD, valueB, valueA, valueC]);
  });
  it('should sort number desc', () => {
    const valueA: Mock = { value: 12, type: 'aaa' };
    const valueB: Mock = { value: 3, type: 'bbb' };
    const valueC: Mock = { value: 78, type: 'ccc' };
    const valueD: Mock = { value: -1, type: 'ddd' };
    expect(pipe.transform([valueA, valueB, valueC, valueD], 'value', 'desc')).toEqual([valueC, valueA, valueB, valueD]);
  });
  it('should sort string asc', () => {
    const valueA: Mock = { value: 12, type: 'aaa' };
    const valueB: Mock = { value: 3, type: 'bbb' };
    const valueC: Mock = { value: 78, type: 'ccc' };
    const valueD: Mock = { value: -1, type: 'ddd' };
    expect(pipe.transform([valueD, valueB, valueA, valueC], 'type', 'asc')).toEqual([valueA, valueB, valueC, valueD]);
  });
  it('should sort string desc', () => {
    const valueA: Mock = { value: 12, type: 'aaa' };
    const valueB: Mock = { value: 3, type: 'bbb' };
    const valueC: Mock = { value: 78, type: 'ccc' };
    const valueD: Mock = { value: -1, type: 'ddd' };
    expect(pipe.transform([valueA, valueB, valueC, valueD], 'type', 'desc')).toEqual([valueD, valueC, valueB, valueA]);
  });
  it('should sort asc property not null first', () => {
    const valueA: Mock = { value: 12 };
    const valueB: Mock = { value: undefined };
    const valueC: Mock = { value: 78 };
    const valueD: Mock = { value: 1 };
    expect(pipe.transform([valueB, valueA, valueC, valueD], 'value', 'asc')).toEqual([valueD, valueA, valueC, valueB]);
  });
  it('should sort desc property not null first', () => {
    const valueA: Mock = { value: 12 };
    const valueB: Mock = { value: undefined };
    const valueC: Mock = { value: 78 };
    const valueD: Mock = { value: 1 };
    expect(pipe.transform([valueA, valueC, valueD, valueB], 'value', 'desc')).toEqual([valueC, valueA, valueD, valueB]);
  });
  it('should sort desc boolean properties with false first ', () => {
    const valueA: Mock = { value: 12, bool: true };
    const valueB: Mock = { value: 13, bool: false };
    const valueC: Mock = { value: 78, bool: true };
    const valueD: Mock = { value: -1, bool: false };
    expect(pipe.transform([valueA, valueB, valueC, valueD], 'bool', 'desc')).toEqual([valueB, valueD, valueA, valueC]);
  });
});
