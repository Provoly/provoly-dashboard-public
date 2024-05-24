export interface AnalyticWidgetOptions {
  primaryProp: string;
  secondaryProp?: string;
  verticalProp: string;
  valueProp: string;
  colorConfig?: {
    prop: string;
    colors: string[];
  };
  // @TODO remove later when field formatting is implemented
  format?: {
    suffix?: string;
  };
}
