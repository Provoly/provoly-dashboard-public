import { DashboardGridLayout, WidgetLayout, WidgetManifest } from '../../../../core/model/manifest.interface';
import { AutomaticGridLayoutDefinition } from '../../../../core/model/automatic-grid-layout-definition.interface';

const arrayOf = (item: any, num: number) => {
  return [...new Array(num)].map(() => item);
};

export const createPlacedWidgetCopy = (widget: WidgetManifest, position: WidgetLayout) => {
  const tmp = structuredClone(widget) as WidgetManifest;
  if (!tmp.layout) {
    tmp.layout = {} as WidgetManifest['layout'];
  }
  tmp.layout.x = position.x;
  tmp.layout.y = position.y;
  tmp.layout.width = position.width;
  tmp.layout.height = position.height;
  return tmp as WidgetManifest;
};

export const WidgetPlacementUtils = {
  layouts: [
    {
      type: DashboardGridLayout.MANUAL,
      places: [],
      label: '@pry.toolbox.layout.0',
      description: '@pry.toolbox.layout.0_detailled',
      rows: 12,
      columns: 12
    },
    {
      type: DashboardGridLayout.FULL,
      places: [{ x: 1, y: 1, width: 12, height: 12 }],
      label: '@pry.toolbox.layout.1',
      description: '@pry.toolbox.layout.1_detailled',
      rows: 12,
      columns: 12
    },
    {
      type: DashboardGridLayout.HALF_HORIZONTAL,
      places: [
        { x: 1, y: 1, width: 12, height: 6 },
        { x: 1, y: 7, width: 12, height: 6 }
      ],
      label: '@pry.toolbox.layout.1/2h',
      description: '@pry.toolbox.layout.1/2h_detailled',
      rows: 12,
      columns: 12
    },
    {
      type: DashboardGridLayout.HALF_VERTICAL,
      places: [
        { x: 1, y: 1, width: 6, height: 12 },
        { x: 7, y: 1, width: 6, height: 12 }
      ],
      label: '@pry.toolbox.layout.1/2v',
      description: '@pry.toolbox.layout.1/2v_detailled',
      rows: 12,
      columns: 12
    },
    {
      type: DashboardGridLayout.THIRD_HORIZONTAL,
      places: [
        { x: 1, y: 1, width: 12, height: 4 },
        { x: 1, y: 5, width: 12, height: 4 },
        { x: 1, y: 9, width: 12, height: 4 }
      ],
      label: '@pry.toolbox.layout.1/3h',
      description: '@pry.toolbox.layout.1/3h_detailled',
      rows: 12,
      columns: 12
    },
    {
      type: DashboardGridLayout.THIRD_VERTICAL,
      places: [
        { x: 1, y: 1, width: 4, height: 12 },
        { x: 5, y: 1, width: 4, height: 12 },
        { x: 9, y: 1, width: 4, height: 12 }
      ],
      label: '@pry.toolbox.layout.1/3v',
      description: '@pry.toolbox.layout.1/3v_detailled',
      rows: 12,
      columns: 12
    },
    {
      type: DashboardGridLayout.QUARTER,
      places: [
        { x: 1, y: 1, width: 6, height: 6 },
        { x: 1, y: 7, width: 6, height: 6 },
        { x: 7, y: 1, width: 6, height: 6 },
        { x: 7, y: 7, width: 6, height: 6 }
      ],
      label: '@pry.toolbox.layout.1/4',
      description: '@pry.toolbox.layout.1/4_detailled',
      rows: 12,
      columns: 12
    }
  ] as AutomaticGridLayoutDefinition[],
  addGridLayout(layout: AutomaticGridLayoutDefinition) {
    this.layouts.push(layout);
  },
  isLeft: (w1: WidgetManifest, w2: WidgetManifest) => w2.layout.x + w2.layout.width <= w1.layout.x,
  isBelow: (w1: WidgetManifest, w2: WidgetManifest) => w2.layout.y + w2.layout.height <= w1.layout.y,
  areDisjoint: (w1: WidgetManifest, w2: WidgetManifest) =>
    WidgetPlacementUtils.isLeft(w1, w2) ||
    WidgetPlacementUtils.isLeft(w2, w1) ||
    WidgetPlacementUtils.isBelow(w1, w2) ||
    WidgetPlacementUtils.isBelow(w2, w1),
  placementOptions: (widgetToPlace: WidgetManifest, layout: string) => {
    const layoutO = WidgetPlacementUtils.getLayout(layout);
    if (!layoutO) {
      return [];
    }
    return layoutO.places.map((place) => ({ ...widgetToPlace, layout: place }));
  },
  swapArrayElements: (arr: any[], x: number, y: number) => {
    if (arr.length === 1) return arr;
    arr.splice(y, 1, arr.splice(x, 1, arr[y])[0]);
    return arr;
  },
  getOverlaps: (widgets: WidgetManifest[]): WidgetManifest[][] => {
    const problems: WidgetManifest[][] = [];
    widgets.forEach((widget, i) => {
      const widgetProblems: WidgetManifest[] = [];
      widgets.forEach((withWidget, j) => {
        if (i < j && !WidgetPlacementUtils.areDisjoint(widget, withWidget)) {
          widgetProblems.push(withWidget);
        }
      });
      if (widgetProblems.length > 0) {
        problems.push([widget, ...widgetProblems]);
      }
    });
    // Resolve problems bottom-up or priorities will be messed up
    problems.sort((a, b) => a[0].layout.y * 100000 - b[0].layout.y * 100000 + a[0].layout.x - b[0].layout.y);
    return problems;
  },
  getLayout(layout: string) {
    return this.layouts.find((lay) => lay.type === layout);
  }
};
