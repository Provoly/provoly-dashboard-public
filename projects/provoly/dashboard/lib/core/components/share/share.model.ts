export enum PryVisibilityType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  RESTRICTED = 'RESTRICTED'
}

export interface Group {
  id: string;
  name: string;
  system: boolean;
}

export interface MissingGroupsByEntity {
  // UUID: [group1, group2, ...]
  [key: string]: string[];
}

export interface ShareConflict {
  missingGroupsByEntity: MissingGroupsByEntity;
}

// TODO remove when removed all usages (dashboards, restitutions, widgets)
export interface PryVisibility {
  type: PryVisibilityType;
  users?: any[];
}
