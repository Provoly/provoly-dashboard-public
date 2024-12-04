import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ContextMenuSelectors, DashboardActions, Item, PryI18nService, PrySnackbarService } from '@provoly/dashboard';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { ItemActions } from './item.actions';
import { ItemEffects } from './item.effects';
import { ItemService } from './item.service';

describe('Item Effects', () => {
  let actions$: Observable<any>;
  let effects: ItemEffects;
  let store: MockStore<any>;
  let itemService: ItemService;
  let snackbarService: PrySnackbarService;
  PryI18nService.warn = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemEffects,
        provideMockStore({
          selectors: [{ selector: ContextMenuSelectors.resultSet, value: '' }]
        }),
        provideMockActions(() => actions$),
        {
          provide: ItemService,
          useValue: {
            create: (item: Item) => of([item])
          }
        },
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => null,
            notMitigatedOpen: () => null
          }
        }
      ]
    });

    effects = TestBed.inject(ItemEffects);
    itemService = TestBed.inject<ItemService>(ItemService);
    snackbarService = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should create item and add it to result set', () => {
    const spy = jest.spyOn(itemService, 'create');
    let item: Item = { id: 'id', oClass: 'test', attributes: {} };

    actions$ = hot('a', {
      a: ItemActions.create({ item: item, datasetVersionId: 'my-ds-v-id' })
    });

    const expected$ = hot('(ab)', {
      a: ItemActions.createSuccess({ id: 'id' }),
      b: DashboardActions.addItemToResultSets({ item, resultSet: '' })
    });

    expect(effects.create$).toBeObservable(expected$);
    expect(effects.create$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should catch error on item creation', () => {
    const spy = jest.spyOn(itemService, 'create').mockReturnValue(
      throwError(() => {
        throw new Error('error');
      })
    );
    let item: Item = { id: 'id', oClass: 'test', attributes: {} };

    actions$ = hot('a', {
      a: ItemActions.create({ item: item, datasetVersionId: 'my-ds-v-id' })
    });

    const expected$ = hot('(a)', {
      a: ItemActions.createFailure({ error: Error('error') })
    });

    expect(effects.create$).toBeObservable(expected$);
    expect(effects.create$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should open snackbar on success', () => {
    const spy = jest.spyOn(snackbarService, 'notMitigatedOpen');

    actions$ = hot('a', {
      a: ItemActions.createSuccess({ id: 'id' })
    });

    expect(effects.createSuccessWarning$).toBeObservable(cold('a', { a: ItemActions.createSuccess({ id: 'id' }) }));
    expect(effects.createSuccessWarning$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });
});
