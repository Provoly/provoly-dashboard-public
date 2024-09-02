import { HttpUrlEncodingCodec } from '@angular/common/http';

const operators = [
  'EQUALS',
  'CONTAINS',
  'I_CONTAINS',
  'GREATER_THAN',
  'START_WITH',
  'END_WITH',
  'LOWER_THAN',
  'INSIDE',
  'OUTSIDE',
  'IN',
  'NOT_IN'
];

export class FilterParamEncoder extends HttpUrlEncodingCodec {
  constructor() {
    super();
  }

  override encodeValue(v: string): string {
    const hasOperator = operators.includes(v.split(',')?.[1]);
    if (hasOperator) {
      return v;
    }
    return encodeURIComponent(v);
  }
}
