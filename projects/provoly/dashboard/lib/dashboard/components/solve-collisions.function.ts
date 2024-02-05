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
  const nextWidgetList: WidgetManifest[] = candidateWidget
    ? JSON.parse(
        JSON.stringify([
          {
            ...candidateWidget,
            layout: { ...(candidateWidget?.layout ?? { x: 1, y: 1, width: 1, height: 1 }) }
          },
          ...initialWidgetManifestList
        ])
      )
    : [];

  // Force all layout values to be positive and cannot be outside the grid
  const columns = dashboardManifest.grid?.columns ?? DEFAULT_COLUMNS_NUMBER;
  nextWidgetList.forEach((w) => {
    w.layout.height = w.layout.height <= 0 ? 1 : w.layout.height;
    w.layout.width = w.layout.width <= 0 ? 1 : w.layout.width;
    w.layout.x =
      w.layout.x <= 0 ? 1 : w.layout.x + w.layout.width > columns ? columns - w.layout.width + 1 : w.layout.x;
    w.layout.y = w.layout.y <= 0 ? 1 : w.layout.y;
  });
  let rows = dashboardManifest.grid?.rows ?? DEFAULT_ROWS_NUMBER;

  let overlappingWidgets = WidgetPlacementUtils.getOverlaps(initialWidgetManifestList);
  if (overlappingWidgets.length > 0) {
    console.warn('Widgets are already overlapping. We cannot have a correct solution for this.');
  }

  const layout = dashboardManifest.grid?.layout ?? DashboardGridLayout.MANUAL;

  let result = undefined;
  if (!solvingCollisionOptions.invertedGravity || layout !== DashboardGridLayout.MANUAL) {
    result = {
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

    result = {
      ...dashboardManifest,
      grid: {
        ...dashboardManifest.grid
      },
      widgets: nextWidgetList
    };
  }

  const newOverlaps = WidgetPlacementUtils.getOverlaps(result.widgets);
  return newOverlaps.length > 0 ? dashboardManifest : result;
}
