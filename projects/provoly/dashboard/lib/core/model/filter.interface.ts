export interface Filter {
  id: string;
  name: string;
  type: string;
  attributes: { id: string; name: string; label: string; datasource: string }[];
  operator?: string;
  value?: string | number;
  possibleValues?: string;
  hasDateRange?: boolean;
  limit?: number;
}

export interface FilterContext {
  attribute: string;
  operator: string;
  value: string | undefined | number;
}
