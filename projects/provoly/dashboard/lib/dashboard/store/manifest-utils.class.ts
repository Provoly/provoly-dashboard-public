import { GlobalManifest } from '../../core/model/manifest.interface';

export class ManifestUtils {
  public static getDatasourcesUsedByManifest(manifest: GlobalManifest): string[] {
    return [
      ...new Set<string>(
        manifest.windows
          .map((window) => window.widgets.map((widget) => widget.datasource))
          .flat(3)
          .filter((dataset) => !!dataset) as string[]
      )
    ];
  }
}
