import { ManifestDescription } from '../../model/manifest.interface';
import { Dataset } from '../../store/data-source/data-source.model';
import { Group } from './share.model';
import { PryI18nService } from '../../i18n/i18n.service';

export const READ_ACCESS = 'READ';
export const WRITE_ACCESS = 'WRITE';

// GROUP UTIL METHODS

export const getGroupLabel = (group: Group, i18n: PryI18nService): string => {
  return group.system ? i18n.instant('@pry.share.groups.' + group.name) : group.name;
};

export const getGroupLabelByName = (groupName: string, i18n: PryI18nService): string => {
  return i18n.instant('@pry.share.groups.' + groupName).startsWith('@')
    ? groupName
    : i18n.instant('@pry.share.groups.' + groupName);
};

// DASHBOARD GROUP RIGHTS METHODS

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

// ACCESS RIGHTS METHODS

export const getAccessRightsArrayByGroup = (accessByGroup: { [key: string]: string }): { [key: string]: string[] } => {
  let result: { [key: string]: string[] } = {};
  Object.keys(accessByGroup).forEach((key) => {
    result[key] = getAccessArray(accessByGroup[key]);
  });
  return result;
};

export const getAccessArray = (access: string): string[] => {
  switch (access) {
    case READ_ACCESS:
      return ['READ'];
    case WRITE_ACCESS:
      return ['WRITE', 'READ'];
    default:
      return [];
  }
};

export const getAccessRightsStringByGroup = (accessByGroup: { [key: string]: string[] }): { [key: string]: string } => {
  let result: { [key: string]: string } = {};
  Object.keys(accessByGroup).forEach((key) => {
    result[key] = getAccessString(accessByGroup[key]);
  });
  return result;
};

export const getAccessString = (accessArray: string[]): string => {
  if (accessArray.includes('WRITE')) {
    return WRITE_ACCESS;
  } else {
    return READ_ACCESS;
  }
};
