import { createReducer, on } from '@ngrx/store';
import { PryTransfo } from '../components/pipeline-editor/pipeline.interface';
import { PipelineActions, PipelineResponse } from './pipeline.actions';

export const pipelineFeatureKey = '@pry/pipeline';

export interface PipelineState {
  selectedNode: string;
  checkResponse: PipelineResponse | undefined;
  transfos: PryTransfo[];
  error: any;
  activeError: any;
  loading: boolean;
}

export const initialPipelineState: PipelineState = {
  selectedNode: '',
  checkResponse: undefined,
  transfos: [],
  error: undefined,
  activeError: undefined,
  loading: false
};

export const pipelineReducer = createReducer(
  initialPipelineState,
  on(PipelineActions.select, (state, action) => ({
    ...state,
    selectedNode: action.id
  })),
  on(PipelineActions.setResponse, (state, action) => ({
    ...state,
    checkResponse: action.response
  })),
  on(PipelineActions.fetchTransfosList, (state) => ({
    ...state,
    loading: true
  })),
  on(PipelineActions.fetchTransfosListSuccess, (state, action) => ({
    ...state,
    transfos: action.transfos,
    loading: false
  })),
  on(PipelineActions.fetchTransfosListFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false
  })),
  on(PipelineActions.toggleActivation, (state, action) => ({
    ...state,
    activeError: undefined,
    loading: action.transfo.active
  })),
  on(PipelineActions.activationError, (state, action) => ({
    ...state,
    activeError: {
      id: action.id,
      error: action.error
    },
    loading: false
  }))
);
