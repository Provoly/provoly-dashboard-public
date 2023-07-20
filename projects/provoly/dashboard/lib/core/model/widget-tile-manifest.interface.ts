export interface TileWidgetOptions {
  metadata?: {
    [classId: string]: { property: string; label: string }[];
  };
  classes?: string[];
  breakpoint?: number;
}
