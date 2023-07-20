import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPipeline from './pipeline.reducer';

const feature = createFeatureSelector<fromPipeline.PipelineState>(fromPipeline.pipelineFeatureKey);

const selectedNodeId = createSelector(feature, (state) => state?.selectedNode);
const checkResponse = createSelector(feature, (state) => state?.checkResponse);
const transfos = createSelector(feature, (state) => state?.transfos);
const activeError = createSelector(feature, (state) => state?.activeError);
const transfo = (id: string) =>
  createSelector(feature, (state) => {
    return state.transfos.find((transfo) => transfo.id === id);
  });

export const PipelineSelectors = {
  selectedNodeId,
  checkResponse,
  transfos,
  transfo,
  activeError
};
