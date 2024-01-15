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

// TODO remove when removed all usages (dashboards, restitutions, widgets)
export interface PryVisibility {
  type: PryVisibilityType;
  users?: any[];
}
