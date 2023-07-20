import { pipelineFeatureKey } from './pipeline.reducer';
import { PipelineSelectors } from './pipeline.selectors';

export const initialState = {
  [pipelineFeatureKey]: {
    selectedNode: 'selected-node',
    checkResponse: {
      id: 'my-id',
      errors: [],
      status: []
    }
  }
};

describe('Pipeline Selectors', () => {
  it('should select the selected node id', () => {
    expect(PipelineSelectors.selectedNodeId(initialState)).toEqual('selected-node');
  });

  it('should select the response', () => {
    expect(PipelineSelectors.checkResponse(initialState)?.id).toEqual('my-id');
  });
});
