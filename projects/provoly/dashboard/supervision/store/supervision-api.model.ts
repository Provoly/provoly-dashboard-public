export interface Infrastructure {
  missing: boolean;
  replicas: number;
  available: number;
  minReplicas: number;
  maxReplicas: number;
  title: string;
  hotScale: boolean;
  name: string;
  status?: string;
}

export interface LastInfrastructureScale {
  name: string;
  time: string;
  up: boolean;
}

export interface InputFlow {
  idFlow: string;
  name: string;
  nbIntegrationOk: number;
  nbIntegrationKo: number;
  format: string;
  status: boolean;
  dateIntegration: string;
  accessLink: string;
  startProcessorLink: string;
  stopProcessorLink: string;
}

export interface ErrorDetails {
  label: string;
  count: number;
}

export interface IntegrationError {
  oClass: string;
  errors: ErrorDetails[];
}
