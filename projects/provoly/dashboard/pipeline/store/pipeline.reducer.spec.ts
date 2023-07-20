import { ExecutionState, PryTransfo } from '../components/pipeline-editor/pipeline.interface';
import { PipelineActions } from './pipeline.actions';
import { pipelineReducer, PipelineState } from './pipeline.reducer';

describe('Pipeline Reducer', () => {
  const initialState: PipelineState = {
    selectedNode: 'selected-node',
    checkResponse: {
      id: 'my-id',
      errors: [],
      status: []
    },
    transfos: [],
    error: [],
    activeError: [],
    loading: false
  };

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = pipelineReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('a select action', () => {
    it('should change the selected id value', () => {
      const result = pipelineReducer(initialState, PipelineActions.select({ id: 'new-selected-node' }));

      expect(result).toEqual({ ...initialState, selectedNode: 'new-selected-node' });
    });
  });

  describe('a set response action', () => {
    it('should change the response value', () => {
      const result = pipelineReducer(
        initialState,
        PipelineActions.setResponse({
          response: {
            id: 'my-new-id',
            errors: [{ code: 'a', params: [] }],
            status: [{ nodeId: 'id', outModel: { attributes: [] }, errors: [] }]
          }
        })
      );

      expect(result).toEqual({
        ...initialState,
        checkResponse: {
          id: 'my-new-id',
          errors: [{ code: 'a', params: [] }],
          status: [{ nodeId: 'id', outModel: { attributes: [] }, errors: [] }]
        }
      });
    });
  });

  describe('a check action', () => {
    it('should not change state', () => {
      const result = pipelineReducer(initialState, PipelineActions.check({ graph: {} }));

      expect(result).toEqual(initialState);
    });
  });

  describe('transformations', () => {
    it('should fetch transformations', () => {
      const result = pipelineReducer(initialState, PipelineActions.fetchTransfosList());

      expect(result).toEqual({
        ...initialState,
        loading: true
      });
    });

    it('should succeed if fetched', () => {
      let transformation = {
        id: '1',
        title: 'transfo 1',
        version: '1',
        creationDate: new Date('01-01-2023').toDateString(),
        description: '',
        active: false,
        lastJobExecution: {
          uuid: '2',
          status: ExecutionState.TERMINATED,
          executionDate: new Date('01-01-2023').toDateString()
        },
        links: [],
        nodes: []
      } as PryTransfo;

      const result = pipelineReducer(
        initialState,
        PipelineActions.fetchTransfosListSuccess({
          transfos: [transformation]
        })
      );

      expect(result).toEqual({
        ...initialState,
        transfos: [transformation],
        loading: false
      });
    });

    it('should fail on error', () => {
      const result = pipelineReducer(initialState, PipelineActions.fetchTransfosListFailure({ error: 'test-error' }));

      expect(result).toEqual({
        ...initialState,
        error: 'test-error',
        loading: false
      });
    });
  });
});
