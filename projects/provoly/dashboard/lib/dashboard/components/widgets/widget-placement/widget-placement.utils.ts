import { DashboardGridLayout, WidgetLayout, WidgetManifest } from '../../../../core/model/manifest.interface';
import { DashboardCellParams } from '../../../store/dashboard.actions';
import { DEFAULT_COLUMNS_NUMBER, DEFAULT_ROWS_NUMBER } from '../../../store/dashboard.contants';

const arrayOf = (item: any, num: number) => {
  return [...new Array(num)].map(() => item);
};

export const createPlacedWidgetCopy = (widget: WidgetManifest, position: WidgetLayout) => {
  const tmp = JSON.parse(JSON.stringify(widget));
  if (!tmp.layout) {
    tmp.layout = {};
  }
  tmp.layout.x = position.x;
  tmp.layout.y = position.y;
  tmp.layout.width = position.width;
  tmp.layout.height = position.height;
  return tmp as WidgetManifest;
};

export type LayoutSizeImplementationFn = (
  outLayout: { x: number; y: number; height: number; width: number },
  params: Partial<DashboardCellParams>
) => { x: number; y: number; height: number; width: number }[];

export type LayoutPlacementOptionImplementationFn = (
  widgetToPlace: WidgetManifest,
  sizes: WidgetLayout[],
  params: Partial<DashboardCellParams>
) => WidgetManifest[];

export const WidgetPlacementUtils = {
  layoutSizeImplementations: {
    [DashboardGridLayout.MANUAL]: (
      outLayout: { x: number; y: number; height: number; width: number },
      params: Partial<DashboardCellParams>
    ) => {
      outLayout.height = params.rows ?? DEFAULT_ROWS_NUMBER;
      outLayout.width = params.columns ?? DEFAULT_COLUMNS_NUMBER;
      return arrayOf(outLayout, 20);
    },
    [DashboardGridLayout.FULL]: (
      outLayout: { x: number; y: number; height: number; width: number },
      params: Partial<DashboardCellParams>
    ) => {
      outLayout.height = params.rows ?? DEFAULT_ROWS_NUMBER;
      outLayout.width = params.columns ?? DEFAULT_COLUMNS_NUMBER;
      return [outLayout];
    },
    [DashboardGridLayout.QUARTER]: (
      outLayout: { x: number; y: number; height: number; width: number },
      params: Partial<DashboardCellParams>
    ) => {
      outLayout.height = Math.floor((params.rows ?? DEFAULT_ROWS_NUMBER) / 2);
      outLayout.width = Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2);
      return [outLayout, outLayout, outLayout, outLayout];
    },
    [DashboardGridLayout.HALF_HORIZONTAL]: (
      outLayout: { x: number; y: number; height: number; width: number },
      params: Partial<DashboardCellParams>
    ) => {
      outLayout.height = Math.floor((params.rows ?? DEFAULT_ROWS_NUMBER) / 2);
      outLayout.width = params.columns ?? DEFAULT_COLUMNS_NUMBER;
      return [outLayout, outLayout];
    },
    [DashboardGridLayout.HALF_VERTICAL]: (
      outLayout: { x: number; y: number; height: number; width: number },
      params: Partial<DashboardCellParams>
    ) => {
      outLayout.height = params.rows ?? DEFAULT_ROWS_NUMBER;
      outLayout.width = Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2);
      return [outLayout, outLayout];
    },
    [DashboardGridLayout.THIRD_HORIZONTAL]: (
      outLayout: { x: number; y: number; height: number; width: number },
      params: Partial<DashboardCellParams>
    ) => {
      outLayout.height = Math.floor((params.rows ?? DEFAULT_ROWS_NUMBER) / 3);
      outLayout.width = params.columns ?? DEFAULT_COLUMNS_NUMBER;
      return [outLayout, outLayout, outLayout];
    },
    [DashboardGridLayout.THIRD_VERTICAL]: (
      outLayout: { x: number; y: number; height: number; width: number },
      params: Partial<DashboardCellParams>
    ) => {
      outLayout.height = params.rows ?? DEFAULT_ROWS_NUMBER;
      outLayout.width = Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 3);
      return [outLayout, outLayout, outLayout];
    }
  } as {
    [layout: string]: LayoutSizeImplementationFn;
  },
  placementOptionsImplementations: {
    // Manual mode do not offer automatic placement solutions... propose fullscreen
    [DashboardGridLayout.MANUAL]: (
      widgetToPlace: WidgetManifest,
      sizes: WidgetLayout[],
      params: Partial<DashboardCellParams>
    ) => [createPlacedWidgetCopy(widgetToPlace, { ...sizes[0], x: 1, y: 1 })],
    [DashboardGridLayout.FULL]: (
      widgetToPlace: WidgetManifest,
      sizes: WidgetLayout[],
      params: Partial<DashboardCellParams>
    ) => [createPlacedWidgetCopy(widgetToPlace, { ...sizes[0], x: 1, y: 1 })],
    [DashboardGridLayout.HALF_VERTICAL]: (
      widgetToPlace: WidgetManifest,
      sizes: WidgetLayout[],
      params: Partial<DashboardCellParams>
    ) => [
      createPlacedWidgetCopy(widgetToPlace, { ...sizes[0], x: 1, y: 1 }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[1],
        x: Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2) + 1,
        y: 1
      })
    ],
    [DashboardGridLayout.HALF_HORIZONTAL]: (
      widgetToPlace: WidgetManifest,
      sizes: WidgetLayout[],
      params: Partial<DashboardCellParams>
    ) => [
      createPlacedWidgetCopy(widgetToPlace, { ...sizes[0], x: 1, y: 1 }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[1],
        x: 1,
        y: Math.ceil((params.rows ?? DEFAULT_ROWS_NUMBER) / 2) + 1
      })
    ],
    [DashboardGridLayout.THIRD_VERTICAL]: (
      widgetToPlace: WidgetManifest,
      sizes: WidgetLayout[],
      params: Partial<DashboardCellParams>
    ) => [
      createPlacedWidgetCopy(widgetToPlace, { ...sizes[0], x: 1, y: 1 }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[1],
        x: Math.ceil((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 3) + 1,
        y: 1
      }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[2],
        x: Math.ceil(((params.columns ?? DEFAULT_COLUMNS_NUMBER) * 2) / 3) + 1,
        y: 1
      })
    ],
    [DashboardGridLayout.THIRD_HORIZONTAL]: (
      widgetToPlace: WidgetManifest,
      sizes: WidgetLayout[],
      params: Partial<DashboardCellParams>
    ) => [
      createPlacedWidgetCopy(widgetToPlace, { ...sizes[0], x: 1, y: 1 }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[1],
        x: 1,
        y: Math.ceil((params.rows ?? DEFAULT_ROWS_NUMBER) / 3) + 1
      }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[2],
        x: 1,
        y: Math.ceil(((params.rows ?? DEFAULT_ROWS_NUMBER) * 2) / 3) + 1
      })
    ],
    [DashboardGridLayout.QUARTER]: (
      widgetToPlace: WidgetManifest,
      sizes: WidgetLayout[],
      params: Partial<DashboardCellParams>
    ) => [
      createPlacedWidgetCopy(widgetToPlace, { ...sizes[0], x: 1, y: 1 }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[2],
        x: Math.ceil((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2) + 1,
        y: 1
      }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[1],
        x: 1,
        y: Math.ceil((params.rows ?? DEFAULT_ROWS_NUMBER ?? DEFAULT_ROWS_NUMBER) / 2) + 1
      }),
      createPlacedWidgetCopy(widgetToPlace, {
        ...sizes[3],
        x: Math.ceil((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2) + 1,
        y: Math.ceil((params.rows ?? DEFAULT_ROWS_NUMBER) / 2) + 1
      })
    ]
  } as {
    [layout: string]: LayoutPlacementOptionImplementationFn;
  },
  layoutImages: {
    [DashboardGridLayout.MANUAL]: 'assets/svgs/grid_composition_libre.svg',
    [DashboardGridLayout.THIRD_VERTICAL]: 'assets/svgs/grid_1_3_vertical.svg',
    [DashboardGridLayout.THIRD_HORIZONTAL]: 'assets/svgs/grid_1_3_horizontal.svg',
    [DashboardGridLayout.HALF_VERTICAL]: 'assets/svgs/grid_1_2_vertical.svg',
    [DashboardGridLayout.HALF_HORIZONTAL]: 'assets/svgs/grid_1_2_horizontal.svg',
    [DashboardGridLayout.QUARTER]: 'assets/svgs/grid_1_4.svg',
    [DashboardGridLayout.FULL]: 'assets/svgs/grid_full.svg'
  } as { [layout: string]: string },
  addLayoutImplementation: (
    type: string,
    fnSizeImplementation: LayoutSizeImplementationFn,
    fnPlacementOptionImplementation: LayoutPlacementOptionImplementationFn,
    image?: string
  ) => {
    WidgetPlacementUtils.layoutSizeImplementations[type] = fnSizeImplementation;
    WidgetPlacementUtils.placementOptionsImplementations[type] = fnPlacementOptionImplementation;
    WidgetPlacementUtils.layoutImages[type] = image ?? 'assets/svgs/default.svg';
  },
  getLayouts: () =>
    Object.keys(WidgetPlacementUtils.placementOptionsImplementations).map((layout) => ({
      key: layout,
      image: WidgetPlacementUtils.layoutImages[layout]
    })),
  isLeft: (w1: WidgetManifest, w2: WidgetManifest) => w2.layout.x + w2.layout.width <= w1.layout.x,
  isBelow: (w1: WidgetManifest, w2: WidgetManifest) => w2.layout.y + w2.layout.height <= w1.layout.y,
  areDisjoint: (w1: WidgetManifest, w2: WidgetManifest) =>
    WidgetPlacementUtils.isLeft(w1, w2) ||
    WidgetPlacementUtils.isLeft(w2, w1) ||
    WidgetPlacementUtils.isBelow(w1, w2) ||
    WidgetPlacementUtils.isBelow(w2, w1),
  placementOptions: (widgetToPlace: WidgetManifest, layout: string, params: Partial<DashboardCellParams>) => {
    if (!WidgetPlacementUtils.placementOptionsImplementations[layout]) {
      return [];
    }
    return WidgetPlacementUtils.placementOptionsImplementations[layout](
      widgetToPlace,
      WidgetPlacementUtils.getLayoutSize(layout, params),
      params
    );
  },
  getLayoutSize(layout: string, params: Partial<DashboardCellParams>): WidgetLayout[] {
    if (!WidgetPlacementUtils.layoutSizeImplementations[layout]) {
      return [];
    }
    return WidgetPlacementUtils.layoutSizeImplementations[layout]({ x: 1, y: 1, height: 1, width: 1 }, params);
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
  placesForLayout(layout: string) {
    return this.getLayoutSize(layout, { rows: 1, columns: 1 }).length;
  }
};
