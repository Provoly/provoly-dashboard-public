import { GlobalManifest } from '../../core/model/manifest.interface';

export class ManifestUtils {
  public static getDatasourcesUsedByManifest(manifest: GlobalManifest): { datasetId: string; excludeGeo: boolean }[] {
    const mapOfDatasources = (
      manifest.windows
        .map((window) =>
          window.widgets.map((widget) => ({ datasetId: widget.datasource, excludeGeo: widget.type !== 'map' }))
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
}
