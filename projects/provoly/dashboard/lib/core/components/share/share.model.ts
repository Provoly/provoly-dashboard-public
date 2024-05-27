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
