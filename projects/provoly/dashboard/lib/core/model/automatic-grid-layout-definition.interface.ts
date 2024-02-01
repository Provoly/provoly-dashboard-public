import { WidgetLayout } from './manifest.interface';

export interface AutomaticGridLayoutDefinition {
  type: string;
  places: WidgetLayout[];
  label?: string;
  description?: string;
  rows: number;
  columns: number;
}
