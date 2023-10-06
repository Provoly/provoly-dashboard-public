export interface Versions {
  [key: string]: BackendVersion | FrontendVersion;
}

export interface BackendVersion {
  chartVersion?: string;
  applicationVersion?: string;
}

export interface FrontendVersion {
  libVersion?: string;
}
