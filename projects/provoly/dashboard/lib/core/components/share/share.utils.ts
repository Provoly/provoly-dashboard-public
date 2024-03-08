import { ManifestDescription } from '../../model/manifest.interface';
import { Dataset } from '../../store/data-source/data-source.model';

export const canManifestBeMadePublic = (manifest: ManifestDescription, datasets: Dataset[]): boolean => {
  return manifest.datasource.every((dsId) => {
    const datasource = datasets.find((d) => d.id === dsId);
    return datasource?.groups?.includes('ALL') ?? false;
  });
};

export const getCommonDatasourceGroupsForManifest = (manifest: ManifestDescription, datasets: Dataset[]): string[] => {
  const result = [];
  const dsGroups = manifest.datasource.map((dsId) => datasets.find((d) => d.id === dsId)?.groups ?? []);
  const baseArray = dsGroups[0];
  for (let i = 0; i < baseArray.length; i++) {
    const element = baseArray[i];
    if (dsGroups.every((array) => array.includes(element))) {
      result.push(element);
    }
  }
  return result;
};
