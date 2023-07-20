export interface TableWidgetOptions {
  columns?: ColumnDefinition[];
}

export interface ColumnDefinition {
  label: string;
  type?: string;
  property: string;
  attributeId?: string;
}
