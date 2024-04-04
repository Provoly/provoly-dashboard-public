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
  'OUTSIDE'
];

export class FilterParamEncoder extends HttpUrlEncodingCodec {
  constructor() {
    super();
  }

  override encodeValue(v: string): string {
    const hasOperator = operators.includes(v.split(',')?.[1]);
    if (hasOperator) {
      const fragments = v.split(',');
      fragments[2] = encodeURIComponent(fragments.splice(2).join('\\,'));
      return fragments.slice(0, 3).join(',');
    }
    return encodeURIComponent(v);
  }
}
