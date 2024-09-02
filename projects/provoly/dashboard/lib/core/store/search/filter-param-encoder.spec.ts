import { FilterParamEncoder } from './filter-param-encoder';

describe('FilterParamEncoder', () => {
  const encoder = new FilterParamEncoder();

  it('should not encode commas in filter value for well known operator', () => {
    expect(encoder.encodeValue('ds-id,CONTAINS,filter,value,with,commas')).toBe(
      'ds-id,CONTAINS,filter,value,with,commas'
    );
  });

  it('should encode all commas if query param has no operator (it is not a filter query param))', () => {
    expect(encoder.encodeValue('test,test,test')).toBe('test%2Ctest%2Ctest');
  });
});
