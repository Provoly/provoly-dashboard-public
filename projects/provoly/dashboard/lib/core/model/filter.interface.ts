export interface Filter {
  id: string;
  name: string;
  type: string;
  attributes: { id: string; customId?: string; technicalName: string; label: string; datasource: string }[];
  operator?: string;
  value?: string | number | string[] | number[];
  possibleValues?: string; // only used in list-filter
  hasDateRange?: boolean;
  limit?: number;
  placeholder?: string;
  preventRefreshes?: boolean;
}

export interface FilterContext {
  attribute: string;
  operator: string;
  value: string | number | string[] | number[] | undefined;
  type: string;
}
