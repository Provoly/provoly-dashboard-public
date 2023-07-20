export interface Filter {
  id: string;
  name: string;
  type: string;
  attributes: { id: string; name: string; label: string; datasource: string }[];
  operator?: string;
  value?: string;
  possibleValues?: string;
  hasDateRange?: boolean;
}

export interface FilterContext {
  attribute: string;
  operator: string;
  value: string | undefined;
}
