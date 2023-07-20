import { DashboardGridLayout, DashboardManifest, WidgetManifest } from '../../core/model/manifest.interface';
import { WidgetPlacementUtils } from '../components/widgets/widget-placement/widget-placement.utils';
import { DEFAULT_COLUMNS_NUMBER, DEFAULT_ROWS_NUMBER } from '../store/dashboard.contants';

export function orderWidgetsAccordingToPlacement(
  a: WidgetManifest & { layout: { weight?: number } },
  b: WidgetManifest & { layout: { weight?: number } }
): number {
  return (
    (b.layout.weight ?? 0) * 1000000 -
    (a.layout.weight ?? 0) * 1000000 +
    (b.layout.y + b.layout.height / 2) * 100000 -
    (a.layout.y + a.layout.height / 2) * 100000 +
    (b.layout.x + b.layout.width / 2) -
    (a.layout.x + a.layout.width / 2)
  );
}

export const solvingCollisionOptions = {
  invertedGravity: false,
  minRows: 0
};

export function solveCollisions(
  candidateWidget: WidgetManifest,
  initialWidgetManifestList: WidgetManifest[],
  dashboardManifest: DashboardManifest
): DashboardManifest {
  let rows = dashboardManifest.grid?.rows ?? DEFAULT_ROWS_NUMBER;
  const nextWidgetList: WidgetManifest[] = candidateWidget
    ? JSON.parse(
        JSON.stringify([
          {
            ...candidateWidget,
            layout: { ...(candidateWidget?.layout ?? { x: 1, y: 1, width: 1, height: 1 }), weight: 10 }
          },
          ...initialWidgetManifestList
        ])
      )
    : [];
  let nonBlocking = 10000;

  // Force all layout values to be positive and cannot be outside the grid
  const actualCols = dashboardManifest.grid?.columns ?? DEFAULT_COLUMNS_NUMBER;
  nextWidgetList.forEach((w) => {
    w.layout.height = w.layout.height <= 0 ? 1 : w.layout.height;
    w.layout.width = w.layout.width <= 0 ? 1 : w.layout.width;
    w.layout.x =
      w.layout.x <= 0 ? 1 : w.layout.x + w.layout.width > actualCols ? actualCols - w.layout.width + 1 : w.layout.x;
    w.layout.y = w.layout.y <= 0 ? 1 : w.layout.y;
  });

  let overlappingWidgets = WidgetPlacementUtils.getOverlaps(nextWidgetList);
  while (overlappingWidgets.length > 0 && nonBlocking > 0) {
    overlappingWidgets.forEach((widgets) => {
      // Keep upmost widget (and leftmost with lower priority)
      const [stayingWidget, ...movingWidgets] = [...widgets].sort(orderWidgetsAccordingToPlacement);
      stayingWidget.layout.y = Math.min(...widgets.map((w) => w.layout.y));
      movingWidgets.forEach(
        (movingWidget) => (movingWidget.layout.y = stayingWidget.layout.y + stayingWidget.layout.height)
      );
    });

    overlappingWidgets = WidgetPlacementUtils.getOverlaps(nextWidgetList);
    nonBlocking--;
  }

  // Adding rows if needed
  rows = Math.max(rows, ...nextWidgetList.map((widget) => widget.layout.y + widget.layout.height - 1));

  nextWidgetList.forEach((widget: WidgetManifest & { layout: { weight?: number } }) => delete widget.layout.weight);

  const layout = dashboardManifest.grid?.layout ?? DashboardGridLayout.MANUAL;

  if (!solvingCollisionOptions.invertedGravity || layout !== DashboardGridLayout.MANUAL) {
    return {
      ...dashboardManifest,
      grid: { ...dashboardManifest.grid, rows },
      widgets: nextWidgetList
    };
  } else {
    // Remove "holes" and adapt complete height
    nextWidgetList.sort((a, b) => a.layout.y - b.layout.y);
    let somethingGoesUp = true;
    while (somethingGoesUp) {
      somethingGoesUp = false;
      nextWidgetList.forEach((w) => {
        if (w.layout.y > 1) {
          const overlapsIfMovedUp = WidgetPlacementUtils.getOverlaps([
            ...nextWidgetList,
            { type: 'placeholder', layout: { ...w.layout, y: Math.max(w.layout.y - 1, 1), height: 1 } }
          ]);
          if (overlapsIfMovedUp.length === 0) {
            w.layout.y--;
            somethingGoesUp = true;
          }
        }
      });
    }

    return {
      ...dashboardManifest,
      grid: {
        ...dashboardManifest.grid,
        rows: Math.max(solvingCollisionOptions.minRows, ...nextWidgetList.map((w) => w.layout.y + w.layout.height - 1))
      },
      widgets: nextWidgetList
    };
  }
}
