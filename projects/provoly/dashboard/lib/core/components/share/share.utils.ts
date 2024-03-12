import { ManifestDescription } from '../../model/manifest.interface';
import { Dataset } from '../../store/data-source/data-source.model';

export const canManifestBeMadePublic = (manifest: ManifestDescription, datasets: Dataset[]): boolean => {
  return manifest.datasource.every((dsId) => {
    const datasource = datasets.find((d) => d.id === dsId);
    return datasource?.groups?.includes('ALL') ?? false;
  });
};

export const getCommonDatasourceGroupsForManifest = (manifest: ManifestDescription, datasets: Dataset[]): string[] => {
  let result = [];
  const allDsGroups = manifest.datasource.map((dsId) => datasets.find((d) => d.id === dsId)?.groups ?? []);
  if (allDsGroups.every((dsGroups) => dsGroups.includes('AUTHENTICATED'))) {
    result = [...new Set(allDsGroups.flat())];
  } else {
    const allDsGroupsFiltered = allDsGroups.filter(
      (dsGroups) => !dsGroups.includes('AUTHENTICATED') && !dsGroups.includes('ALL')
    );
    const baseArray = allDsGroupsFiltered[0];
    for (let i = 0; i < baseArray.length; i++) {
      const group = baseArray[i];
      if (allDsGroupsFiltered.every((dsGroups) => dsGroups.includes(group))) {
        result.push(group);
      }
    }
  }
  return result;
};
