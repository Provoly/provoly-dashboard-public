import { DashboardGridLayout, DashboardManifest, GlobalManifest } from '../../core/model/manifest.interface';
import { DEFAULT_COLUMNS_NUMBER, DEFAULT_GAP_PX, DEFAULT_ROWS_NUMBER } from './dashboard.contants';

export class ManifestUtils {
  public static getDatasourcesUsedByManifest(manifest: GlobalManifest): { datasetId: string; excludeGeo: boolean }[] {
    const mapOfDatasources = (
      manifest.windows
        .map((window) =>
          (window.widgets ?? []).map((widget) => ({ datasetId: widget.datasource, excludeGeo: widget.type !== 'map' }))
        )
        .flat(3)
        .filter((dataset) => !!dataset.datasetId)
        .map((res) =>
          Array.isArray(res.datasetId)
            ? res.datasetId.map((r) => ({ datasetId: r, excludeGeo: res.excludeGeo }))
            : [res]
        )
        .flat() as { datasetId: string; excludeGeo: boolean }[]
    ).reduce(
      (p, c) => ({ ...p, [c.datasetId]: { ...p[c.datasetId], ...c } }),
      {} as { [key: string]: { datasetId: string; excludeGeo: boolean } }
    );
    return Object.values(mapOfDatasources);
  }

  public static cleanupManifest(manifest: GlobalManifest): GlobalManifest {
    return {
      ...manifest,
      windows: manifest.windows.map((window) => ManifestUtils.cleanupDashboardManifest(window))
    };
  }

  private static cleanupDashboardManifest(window: DashboardManifest): DashboardManifest {
    return {
      ...window,
      grid: {
        columns: DEFAULT_COLUMNS_NUMBER,
        rows: DEFAULT_ROWS_NUMBER,
        layout: DashboardGridLayout.MANUAL,
        gap: DEFAULT_GAP_PX,
        ...window.grid
      },
      widgets: window.widgets ?? []
    } as DashboardManifest;
  }
}
