import { Field } from '../store/field/field.interface';

export interface TableWidgetOptions {
  columns?: ColumnDefinition[];
  style?: TableWidgetStyle | any;
}

export interface ColumnDefinition {
  label: string;
  type?: string;
  property: string;
  attributeId?: string;
  field?: Field;
}

export interface TableWidgetStyle {
  headerTextAlign?: string; // 'center' | 'left' | 'right';
  cellTextAlign?: string; // 'center' | 'left' | 'right';
  showVerticalSeparator?: boolean;
}

export const DEFAULT_TABLE_WIDGET_STYLE = {
  value: {
    headerTextAlign: 'center',
    cellTextAlign: 'center',
    showVerticalSeparator: false
  }
};

export const ALIGNMENT_OPTIONS = ['center', 'left', 'right'];
