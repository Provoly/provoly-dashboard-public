import { DateRange } from '../components/date-picker/date-picker.component';
import { NamedQueryTypes } from '../store/data-source/named-query-types.model';
import { OperatorType } from './search-mono-class.model';

export interface MultiClassCondition {
  id: string;
  field: string;
  operator: OperatorType;
  value: string | number | DateRange | null;
  upperValue?: string | number | null;
  pattern?: string;
  isDate: boolean;
}

export interface MultiClassFieldSelection {
  id: string;
  name: string;
  classes: string[];
}

export interface MultiSearchPayload {
  type: NamedQueryTypes.MULTI_CLASS | NamedQueryTypes.FULL_TEXT;
  icon?: string;
  multiType: 'AND' | 'OR';
  oClasses?: string[];
}

export interface MultiClassSearchPayload extends MultiSearchPayload {
  fullSearch: null;
  fields: MultiClassField[];
}

export interface MultiClassField {
  field: string;
  operator?: OperatorType;
  value: string | number;
  upperValue?: string | number;
}

export interface FullTextSearchPayload extends MultiSearchPayload {
  fullSearch: {
    value: string;
  };
}
