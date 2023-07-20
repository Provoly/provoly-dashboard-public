export enum PryVisibilityType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  RESTRICTED = 'RESTRICTED'
}

export interface PryVisibility {
  type: PryVisibilityType;
  users?: any[];
}
