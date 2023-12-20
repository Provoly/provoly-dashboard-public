import { createAction, props } from '@ngrx/store';
import { PryTransfo } from '../components/pipeline-editor/pipeline.interface';

export interface PipelineError {
  code: string;

  [name: string]: any;
}

export interface NodePipelineError extends PipelineError {
  nodeId: string;
}

export interface NodeStatusModel {
  attributes: { technicalName: string; type: string }[];
}

export interface NodeStatus {
  nodeId: string;
  outModel: NodeStatusModel;
  errors: NodePipelineError[];
}

export interface PipelineResponse {
  id: string;
  errors: PipelineError[];
  status: NodeStatus[];
}

export const PipelineActions = {
  select: createAction('[Pipeline] select', props<{ id: string }>()),
  setResponse: createAction('[Pipeline] set response', props<{ response: PipelineResponse }>()),
  check: createAction('[Pipeline] check', props<{ graph: any; fetch?: boolean }>()),
  fetchTransfosList: createAction('[Pipeline] fetching available transfos'),
  fetchTransfosListSuccess: createAction('[Pipeline] received transfos', props<{ transfos: PryTransfo[] }>()),
  fetchTransfosListFailure: createAction('[Pipeline] failure transfos', props<{ error: any }>()),
  toggleActivation: createAction('[Pipeline] toggle transfo activation', props<{ transfo: PryTransfo }>()),
  activationError: createAction('[Pipeline] Error on toggle activate', props<{ id: string; error: any }>()),
  executeTransfo: createAction('[Pipeline] execute transfo', props<{ id: string }>()),
  getTransformation: createAction('[Pipeline] get transformation by id', props<{ id: string }>()),
  getTransformationSuccess: createAction(
    '[Pipeline] get transformation by id success',
    props<{ transfo: PryTransfo }>()
  )
};
