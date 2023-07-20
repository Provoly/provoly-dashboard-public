export interface GraphWidgetOptions {
  linkStrokeColor: string;
  linkStrokeOpacity: number;
  linkStrokeWidth: number;
  linkStrokeLinecap: string;
  nodeStrokeColor: string;
  nodeStrokeWidth: number;
  nodeStrokeOpacity: number;
  nodeRadius: number;
  distance: number;
  strength: number;
  repulsiveStrength: number;
  layout: 'force' | 'simple';
}
