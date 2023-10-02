export type PlaceExpression = (string | number)[];

export interface VegaWidgetOptions {
  placeData?: PlaceExpression;
  baseSpec?: any;
}
