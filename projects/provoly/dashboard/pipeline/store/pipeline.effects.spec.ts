import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { ExecutionState } from '../components/pipeline-editor/pipeline.interface';
import { PipelineActions } from '../store/pipeline.actions';
import { PipelineEffects } from './pipeline.effects';
import { initialState } from './pipeline.selectors.spec';
import { PipelineService } from './pipeline.service';

const transformation = {
  id: '1',
  title: 'transfo 1',
  version: '1',
  creationDate: new Date('01-01-2023').toDateString(),
  description: '',
  active: false,
  lastJobExecution: {
    uuid: '2',
    status: ExecutionState.ERROR,
    executionDate: new Date('01-01-2023').toDateString()
  },
  links: [],
  nodes: []
} as PryTransfo;

describe('PipelineEffects', () => {
  let actions$: Observable<any>;
  let effects: PipelineEffects;
  let pipelineService: PipelineService;
  let store: MockStore<any>;
  let snackbar: PrySnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PipelineEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: PipelineService,
          useValue: {
            check: (graph: any) => of({}),
            list: () => of([]),
            get: (id: string) => of(transformation),
            activate: (id: string) => of(undefined),
            deactivate: (id: string) => of(undefined),
            execute: (id: string) => of(undefined),
            save: (id: string, title: string, description: string) => of(undefined)
          }
        },
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => null
          }
        }
      ]
    });

    effects = TestBed.inject(PipelineEffects);
    pipelineService = TestBed.inject<PipelineService>(PipelineService);
    snackbar = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  /*
  * To reactivate when rxjs7 will be ok with debounceTime pipes...
  it('should call check service and get the response', () => {
    const getSpy = jest.spyOn(pipelineService, 'check').mockReturnValue(of(response));
    store.setState(initialState);

    actions$ = hot('--a-', {
      a: PipelineActions.check({ graph: {} })
    });

    const expected$ = cold('------------a-', {
      a: PipelineActions.setResponse({ response: response })
    });

    expect(effects.callCheck$).toSatisfyOnFlush(() => {
      console.log('RAAAAH');
      expect(getSpy).toHaveBeenCalled();
    });
    expect(effects.callCheck$).toBeObservable(expected$);
  }); */

  it('should call the list() service method and success action', () => {
    const getSpy = jest.spyOn(pipelineService, 'list');
    store.setState(initialState);

    actions$ = hot('--a-', {
      a: PipelineActions.fetchTransfosList()
    });

    const expected$ = hot('--a-', {
      a: PipelineActions.fetchTransfosListSuccess({ transfos: [] })
    });
    expect(effects.listTransfo$).toBeObservable(expected$);
    expect(effects.listTransfo$).toSatisfyOnFlush(() => {
      expect(getSpy).toHaveBeenCalled();
    });
  });

  it('should call the activate() service method and reload', () => {
    const getSpy = jest.spyOn(pipelineService, 'activate');
    store.setState(initialState);

    actions$ = hot('--a-', {
      a: PipelineActions.toggleActivation({ transfo: transformation })
    });

    const expected$ = hot('--a-', {
      a: PipelineActions.fetchTransfosList()
    });
    expect(effects.toggleTransfoActivation$).toBeObservable(expected$);
    expect(effects.toggleTransfoActivation$).toSatisfyOnFlush(() => {
      expect(getSpy).toHaveBeenCalled();
    });
  });

  it('should call the deactivate() service method and reload', () => {
    const getSpy = jest.spyOn(pipelineService, 'deactivate');
    store.setState(initialState);

    actions$ = hot('--a-', {
      a: PipelineActions.toggleActivation({ transfo: { ...transformation, active: true } })
    });

    const expected$ = hot('--a-', {
      a: PipelineActions.fetchTransfosList()
    });
    expect(effects.toggleTransfoActivation$).toBeObservable(expected$);
    expect(effects.toggleTransfoActivation$).toSatisfyOnFlush(() => {
      expect(getSpy).toHaveBeenCalled();
    });
  });

  it('should call the execute() transformation and reload', () => {
    const getSpy = jest.spyOn(pipelineService, 'execute');
    store.setState(initialState);

    actions$ = hot('--a-', {
      a: PipelineActions.executeTransfo({ id: '1' })
    });

    const expected$ = hot('--a-', {
      a: PipelineActions.fetchTransfosList()
    });
    expect(effects.executeTransfo$).toBeObservable(expected$);
    expect(effects.executeTransfo$).toSatisfyOnFlush(() => {
      expect(getSpy).toHaveBeenCalled();
    });
  });

  it('should call the get() transformation and then the success action', () => {
    const getSpy = jest.spyOn(pipelineService, 'get');
    store.setState(initialState);

    actions$ = hot('--a-', {
      a: PipelineActions.getTransformation({ id: '1' })
    });

    const expected$ = hot('--a-', {
      a: PipelineActions.getTransformationSuccess({ transfo: transformation })
    });
    expect(effects.getTransformation$).toBeObservable(expected$);
    expect(effects.getTransformation$).toSatisfyOnFlush(() => {
      expect(getSpy).toHaveBeenCalled();
    });
  });
});
