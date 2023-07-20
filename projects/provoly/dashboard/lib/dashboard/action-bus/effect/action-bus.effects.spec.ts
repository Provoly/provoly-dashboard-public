import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { dashboardInitialState } from '../../store/dashboard.reducers';
import { BusService } from '../service/bus.service';
import { ActionBusEffects } from './action-bus.effects';

describe('ActionBusEffects', () => {
  let actions$: Observable<any>;
  let effects: ActionBusEffects;
  let busService: BusService;
  let store: any;
  const initialState = dashboardInitialState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActionBusEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: BusService,
          useValue: {
            postControl: () => {},
            postData: () => {}
          }
        }
      ]
    });

    effects = TestBed.inject(ActionBusEffects);
    busService = TestBed.inject<BusService>(BusService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('forwardOnBus$', () => {
    it('should not forward only bus actions', () => {
      actions$ = hot('a-b-c-', {
        a: {
          type: 'non-bus action'
        },
        b: {
          type: 'is not a bus action either'
        },
        c: {
          type: 'but this one is a (bus) action'
        }
      });

      const expected$ = hot('----c', {
        c: {
          type: 'but this one is a (bus) action'
        }
      });
      expect(effects.forwardOnBus$).toBeObservable(expected$);
    });
    it('should call postData if action type includes "(bus)"', () => {
      const postData = jest.spyOn(busService, 'postData').mockReturnValue(undefined);
      const postControl = jest.spyOn(busService, 'postControl').mockReturnValue(undefined);

      actions$ = hot('-a', {
        a: {
          type: 'but this one is a (bus) action'
        }
      });

      expect(effects.forwardOnBus$).toSatisfyOnFlush(() => {
        expect(postControl).not.toHaveBeenCalled();
        expect(postData).toHaveBeenCalledTimes(1);
      });
    });
  });
});
