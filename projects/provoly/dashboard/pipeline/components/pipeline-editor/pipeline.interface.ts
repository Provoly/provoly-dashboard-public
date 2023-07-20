export interface PrySerializedPipeline {
  id?: string;
  links: PrySerializedLink[];
  nodes: PrySerializedNode[];
}

export interface PryTransfo extends PrySerializedPipeline {
  id: string;
  title: string;
  description: string;
  version: string;
  active: boolean;
  lastJobExecution?: LastJobExecution | null;
  creationDate: string;
  jobInstanceId?: string;
}

interface LastJobExecution {
  uuid: string;
  status: ExecutionState;
  executionDate: string;
}

export enum ExecutionState {
  STARTED = 'started',
  TERMINATED = 'terminated',
  ERROR = 'error'
}

export interface PrySerializedLink {
  start: PrySerializedSlot;
  end: PrySerializedSlot;
}

export interface PrySerializedSlot {
  id: string;
  slot: number;
}

export interface PrySerializedNode {
  id: string;
  type: string;
  title: string;
  spec: PrySerializedSpec;
  gui: PrySerializedGui;
  subgraph?: {
    nodes: PrySerializedNode[];
    links: PrySerializedLink[];
  };
}

export interface PrySerializedGui {
  pos: any;
  size: any;
}

export interface PrySerializedSpec {
  [key: string]: string | number;
}
