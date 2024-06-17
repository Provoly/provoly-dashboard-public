import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ConfigSelectors,
  DataSourceSelectors,
  SearchService,
  WidgetFactoryService,
  WidgetManifest,
  WmsService
} from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { PrySnackbarService } from '../../core/components/snackbar/snackbar.service';
import { PryI18nService } from '../../core/i18n/i18n.service';
import { Item } from '../../core/model/item.interface';
import { ResultSet } from '../../core/model/result-set.interface';
import { DataSourceService } from '../../core/store/data-source/data-source.service';
import { ItemService } from '../../core/store/item/item.service';
import { SearchActions } from '../../core/store/search/search.actions';
import { DashboardInitService } from './dashboard-init.service';
import { DashboardActions } from './dashboard.actions';
import { DashboardEffects } from './dashboard.effects';
import { dashboardInitialState, DashboardState } from './dashboard.reducers';
import { DashboardSelectors } from './dashboard.selectors';
import { ManifestService } from './manifest.service';
import { PryTitleService } from './title.service';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

const buildState = (state: Partial<DashboardState>) =>
  Object.assign({}, { '@pry/dashboard': JSON.parse(JSON.stringify({ ...dashboardInitialState, ...state })) });

const type = 'placeholder';
const layout = { x: 1, y: 1, width: 1, height: 1 };

describe('DashboardEffects', () => {
  let actions$: Observable<any>;
  let effects: DashboardEffects;
  let dashboardService: DashboardInitService;
  let manifestService: ManifestService;
  let namedQueryService: DataSourceService;
  let itemService: ItemService;
  let title: PryTitleService;
  let translateService: PryI18nService;
  let snackbarService: PrySnackbarService;
  let store: MockStore<any>;
  let router: Router;
  const initialState = dashboardInitialState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: buildState({}),
          selectors: [
            { selector: DashboardSelectors.windowManifest, value: { route: 'a' } },
            { selector: ConfigSelectors.catalog, value: [] },
            { selector: DataSourceSelectors.datasets, value: [] }
          ]
        }),
        {
          provide: DashboardInitService,
          useValue: {
            init: () => {}
          }
        },
        {
          provide: WidgetFactoryService,
          useValue: {
            datasourcesToAutoLoad: (manifest: WidgetManifest) =>
              (Array.isArray(manifest.datasource ?? [])
                ? ((manifest.datasource ?? []) as string[])
                : ([manifest.datasource] as string[])
              ).map((ds) => ({ datasetId: ds, excludeGeo: manifest.type !== 'map' })),
            aggregatesToAutoLoad: (manifest: WidgetManifest) =>
              Array.isArray(manifest.datasource ?? [])
                ? ((manifest.datasource ?? []) as string[])
                : ([manifest.datasource] as string[])
          }
        },
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => {}
          }
        },
        {
          provide: ManifestService,
          useValue: {
            get: () => of({}),
            save: () => of({}),
            list: () => of([]),
            delete: () => of(undefined),
            default: () => of(undefined)
          }
        },
        {
          provide: DataSourceService,
          useValue: {
            get: () => of({})
          }
        },
        {
          provide: PryTitleService,
          useValue: {
            changeTitle: () => undefined
          }
        },
        { provide: PryI18nService, useClass: MockPryI18nService },
        {
          provide: Router,
          useValue: {
            navigateByUrl: () => undefined,
            url: '/url'
          }
        },
        {
          provide: ItemService,
          useValue: {
            get: () => undefined,
            proximity: () => undefined
          }
        },
        {
          provide: SearchService,
          useValue: { getItemsSerializedParams: (id: string, quickOrder: any) => 'filter=someFilter' }
        },
        {
          provide: WmsService,
          useValue: {}
        }
      ]
    });

    effects = TestBed.inject(DashboardEffects);
    dashboardService = TestBed.inject<DashboardInitService>(DashboardInitService);
    manifestService = TestBed.inject<ManifestService>(ManifestService);
    namedQueryService = TestBed.inject<DataSourceService>(DataSourceService);
    itemService = TestBed.inject<ItemService>(ItemService);
    title = TestBed.inject<PryTitleService>(PryTitleService);
    translateService = TestBed.inject<PryI18nService>(PryI18nService);
    snackbarService = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('join$', () => {
    it('should send an update action after a join if main rank', () => {
      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['me', 'new-challenger'], // tenant already added by the reducer of the join action
            manifest: { windows: [{ route: 'a', widgets: [] }] }
          },
          results: {
            ...initialState.results,
            resultSets: { a: { items: {}, relations: [] }, b: { items: {}, relations: [] } }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.join({ sender: 'new-challenger' })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.updateManifestAfterTenantJoin({
          tenants: ['me', 'new-challenger'],
          manifest: { windows: [{ route: 'a', widgets: [] }] },
          resultSets: { a: { items: {}, relations: [] }, b: { items: {}, relations: [] } },
          joining: true,
          selectedIds: [],
          presentation: {},
          display: {
            catalog: false,
            presentationTitle: true,
            search: false,
            toolbox: {
              edit_action: false,
              automate_refresh: false,
              clear_view: false,
              default_size: false,
              filter_settings: false,
              new_tab: false,
              refresh_datasets: false,
              save_view: false,
              save_view_as: false,
              edit_presentation_content: false,
              share: false,
              delete: false,
              dashboard_details: false,
              edit_presentation: false
            },
            useFilters: false,
            edit_toggle: false,
            widgetContextMenu: {
              addToCatalog: true,
              changeSpot: true,
              datasourceSelection: true,
              delete: true,
              maximize: true,
              parameters: true,
              window: true
            }
          }
        })
      });
      expect(effects.join$).toBeObservable(expected$);
    });
  });

  describe('leave$', () => {
    it('should send an update action after a leave if main (remaining) rank', () => {
      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['old-challenger', 'me'],
            manifest: {
              windows: [
                { route: 'a', widgets: [] },
                { route: 'b', widgets: [] }
              ]
            }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.leave({ sender: 'old-challenger' })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.updateManifestAfterTenantLeave({
          tenants: ['me'],
          manifest: { windows: [{ route: 'b', widgets: [] }] },
          selectedIds: []
        })
      });
      expect(effects.leave$).toBeObservable(expected$);
    });

    it('should do nothing if not main (remaining) rank', () => {
      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['old-challenger', 'new-main', 'me'],
            manifest: {
              windows: [{ route: 'a', widgets: [] }]
            }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.leave({ sender: 'old-challenger' })
      });

      const expected$ = hot('----');
      expect(effects.leave$).toBeObservable(expected$);
    });
  });

  describe('requestManifestRoute$', () => {
    it('should send an update action and a follow route action', () => {
      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['me', 'old-challenger'],
            manifest: {
              windows: []
            }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.requestAllRoutes()
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.updateRouteManifest({
          route: '/url'
        })
      });
      expect(effects.requestManifestRoute$).toBeObservable(expected$);
    });
  });

  describe('fetchManifest$', () => {
    it('should send an update action and a follow route action', () => {
      const serviceSpy = jest.spyOn(manifestService, 'get').mockReturnValue(
        of({
          windows: [
            { route: 'a', widgets: [] },
            { route: 'b', widgets: [] }
          ]
        })
      );

      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['me', 'old-challenger'],
            manifest: {
              windows: []
            }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.loadAndActivateManifest({ id: 'mId' })
      });

      const expected$ = hot('--(ab)-', {
        a: DashboardActions.updateManifestAfterFetch({
          manifest: {
            windows: [
              { route: 'a', widgets: [] },
              { route: 'b', widgets: [] }
            ]
          },
          manifestId: 'mId',
          selectedIds: []
        }),
        b: DashboardActions.followManifestRoute()
      });
      expect(effects.loadAndActivateManifest$).toBeObservable(expected$);
      expect(effects.loadAndActivateManifest$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenCalledWith('mId');
      });
    });
  });

  describe('downloadManifest$', () => {
    it('should send an update action and a follow route action', () => {
      const serviceSpy = jest.spyOn(manifestService, 'get').mockReturnValue(
        of({
          windows: [
            { route: 'a', widgets: [] },
            { route: 'b', widgets: [] }
          ]
        })
      );

      const element = {
        click: () => {},
        setAttribute: () => {}
      } as unknown as HTMLElement;
      const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(element);
      const downloadClickSpy = jest.spyOn(element, 'click').mockReturnValue(undefined);

      actions$ = hot('--a-', {
        a: DashboardActions.downloadManifest({ id: 'mId', name: 'name' })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.downloadManifest({ id: 'mId', name: 'name' })
      });

      expect(effects.downloadManifest$).toBeObservable(expected$);
      expect(effects.downloadManifest$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenCalledWith('mId');
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(downloadClickSpy).toHaveBeenCalledWith();
      });
    });
  });

  describe('assertResultSets$', () => {
    it('should send as many named queries as necessary, but not already available ones', () => {
      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            manifest: {
              ...initialState.manifests.manifest,
              windows: [
                {
                  route: 'a',
                  widgets: [
                    { type, layout, datasource: 'a' },
                    { type, layout, datasource: 'b' },
                    {
                      type,
                      layout,
                      datasource: 'already'
                    },
                    {
                      type,
                      layout,
                      datasource: 'already-but-wrong-filter'
                    },
                    {
                      type,
                      layout,
                      datasource: 'already-but-no-previous-filter'
                    },
                    {
                      type: 'map',
                      layout,
                      datasource: 'excludedGeo'
                    }
                  ]
                },
                { route: 'b', widgets: [{ type, layout, datasource: 'c' }] }
              ]
            }
          },
          results: {
            ...initialState.results,
            resultSets: { already: { items: {}, relations: [] } },
            resultSetsParams: {
              already: 'filter=someFilter',
              'already-but-wrong-filter': 'filter=wrong'
            }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.assertResultSets({})
      });

      const expected$ = hot('--(abcdefghijklm)-', {
        a: SearchActions.getDatasourceItems({
          id: 'a',
          excludeGeo: true,
          from: 'DashboardEffects.assertResultSets$-1'
        }),
        b: SearchActions.getDatasourceItems({
          id: 'b',
          excludeGeo: true,
          from: 'DashboardEffects.assertResultSets$-1'
        }),
        c: SearchActions.getDatasourceItems({
          id: 'already-but-wrong-filter',
          excludeGeo: true,
          from: 'DashboardEffects.assertResultSets$-1'
        }),
        d: SearchActions.getDatasourceItems({
          id: 'already-but-no-previous-filter',
          excludeGeo: true,
          from: 'DashboardEffects.assertResultSets$-1'
        }),
        e: SearchActions.getDatasourceItems({
          id: 'excludedGeo',
          excludeGeo: false,
          from: 'DashboardEffects.assertResultSets$-1'
        }),
        f: SearchActions.getDatasourceItems({
          id: 'c',
          excludeGeo: true,
          from: 'DashboardEffects.assertResultSets$-1'
        }),
        g: DashboardActions.triggerAggregate({ id: 'a' }),
        h: DashboardActions.triggerAggregate({ id: 'b' }),
        i: DashboardActions.triggerAggregate({ id: 'already' }),
        j: DashboardActions.triggerAggregate({ id: 'already-but-wrong-filter' }),
        k: DashboardActions.triggerAggregate({ id: 'already-but-no-previous-filter' }),
        l: DashboardActions.triggerAggregate({ id: 'excludedGeo' }),
        m: DashboardActions.triggerAggregate({ id: 'c' })
      });
      expect(effects.assertResultSets$).toBeObservable(expected$);
    });
  });

  describe('startMissingViewAfterViewUpdate$', () => {
    it('should send start missing views action if main rank', () => {
      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['me', 'new-challenger'],
            manifest: { windows: [] }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.updateManifest({
          manifest: { windows: [] },
          selectedIds: []
        })
      });

      const expected$ = hot('--(abc)-', {
        a: DashboardActions.startingMissingViews(),
        b: DashboardActions.assertResultSets({}),
        c: DashboardActions.solveCollisions()
      });
      expect(effects.startMissingViewAfterViewUpdate$).toBeObservable(expected$);
    });
  });

  describe('updateTitle$', () => {
    it('should update title', () => {
      const serviceSpySet = jest.spyOn(title, 'changeTitle').mockReturnValue(undefined);
      const serviceSpyTranslate = jest.spyOn(translateService, 'instant').mockReturnValue('vue X');
      DashboardSelectors.rank.setResult(0);

      actions$ = hot('--a-b-', {
        a: DashboardActions.updateManifest({
          manifest: { windows: [] },
          selectedIds: []
        }),
        b: DashboardActions.declareSenderId({ tenants: [], sender: 'other' })
      });

      const expected$ = hot('--a-b-', {
        a: [
          DashboardActions.updateManifest({
            manifest: { windows: [] },
            selectedIds: []
          }),
          0
        ],
        b: [DashboardActions.declareSenderId({ tenants: [], sender: 'other' }), 0]
      });
      expect(effects.updateTitle$).toBeObservable(expected$);
      expect(effects.updateTitle$).toSatisfyOnFlush(() => {
        expect(serviceSpySet).toHaveBeenCalledTimes(4);
        expect(serviceSpySet).toHaveBeenNthCalledWith(1);
        expect(serviceSpySet).toHaveBeenNthCalledWith(2);
        expect(serviceSpySet).toHaveBeenNthCalledWith(3);
        expect(serviceSpySet).toHaveBeenNthCalledWith(4);
        expect(serviceSpyTranslate).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('currentManifest$', () => {
    it('should send save action with current manifest if manifest not included in action and open snack', () => {
      const serviceSpy = jest.spyOn(manifestService, 'save').mockReturnValue(of({ missingGroupsByEntity: {} }));

      const serviceSpySnack = jest.spyOn(snackbarService, 'open').mockReturnValue();
      const serviceSpyTranslate = jest.spyOn(translateService, 'instant').mockReturnValue('translated');

      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['me', 'old-challenger'],
            manifest: {
              windows: []
            }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.saveManifest({ name: 'mId', id: 'id' })
      });

      const expected$ = hot('--(ab)-', {
        a: DashboardActions.fetchManifestsList(),
        b: DashboardActions.setInitialPresentation({ initial: { windows: [] } })
      });
      expect(effects.saveManifest$).toBeObservable(expected$);
      expect(effects.saveManifest$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenNthCalledWith(
          1,
          'mId',
          { windows: [] },
          'id',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        expect(serviceSpy).toHaveBeenNthCalledWith(
          2,
          'mId',
          { windows: [] },
          'id',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        expect(serviceSpySnack).toHaveBeenNthCalledWith(1, { message: 'translated', type: 'success' });
        expect(serviceSpySnack).toHaveBeenNthCalledWith(2, { message: 'translated', type: 'success' });
        expect(serviceSpyTranslate).toHaveBeenCalledWith('@pry.toolbox.manifest.saved', { viewId: 'mId' });
      });
    });
    it("should send save action with action's manifest if included in action and open snack", () => {
      const serviceSpy = jest.spyOn(manifestService, 'save').mockReturnValue(of({ missingGroupsByEntity: {} }));

      const serviceSpySnack = jest.spyOn(snackbarService, 'open').mockReturnValue();
      const serviceSpyTranslate = jest.spyOn(translateService, 'instant').mockReturnValue('translated');

      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['me', 'old-challenger'],
            manifest: {
              windows: []
            }
          }
        })
      );

      actions$ = hot('--a-', {
        a: DashboardActions.saveManifest({ name: 'name', id: 'id', manifest: { windows: [{ widgets: [] }] } })
      });

      const expected$ = hot('--(ab)-', {
        a: DashboardActions.fetchManifestsList(),
        b: DashboardActions.setInitialPresentation({ initial: { windows: [{ widgets: [] }] } })
      });
      expect(effects.saveManifest$).toBeObservable(expected$);
      expect(effects.saveManifest$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenNthCalledWith(
          1,
          'name',
          { windows: [{ widgets: [] }] },
          'id',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        expect(serviceSpy).toHaveBeenNthCalledWith(
          2,
          'name',
          { windows: [{ widgets: [] }] },
          'id',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        );
        expect(serviceSpySnack).toHaveBeenNthCalledWith(1, { message: 'translated', type: 'success' });
        expect(serviceSpySnack).toHaveBeenNthCalledWith(2, { message: 'translated', type: 'success' });
        expect(serviceSpyTranslate).toHaveBeenCalledWith('@pry.toolbox.manifest.saved', { viewId: 'name' });
      });
    });
  });

  describe('listManifest$', () => {
    /* FIXME: commented because debounce don't let us test effect
    it('should send an update action if main rank', (done) => {
      store.setState(
        buildState({
          ...initialState,
          manifests: {
            ...initialState.manifests,
            sender: 'me',
            tenants: ['me', 'old-challenger'],
            manifest: {
              windows: []
            }
          }
        })
      );

      const serviceSpy = jest.spyOn(manifestService, 'list').mockReturnValue(
        of([
          { name: 'a', manifestUrl: 'a' },
          { name: 'b', manifestUrl: 'b' }
        ] as ManifestDescription[])
      );

      actions$ = hot('--a-', {
        a: DashboardActions.fetchManifestsList()
      });

      effects.listManifests$.subscribe((action) => {
        expect(serviceSpy).toHaveBeenCalledWith();
        expect(action).toEqual(
          DashboardActions.updateManifestsList({
            manifests: [{ name: 'a', manifestUrl: 'a' } as any, { name: 'b', manifestUrl: 'b' }]
          })
        );
        done();
        console.log('DONE', action);
      });
    });*/
  });

  describe('listManifest$', () => {
    it('should send an update action', () => {
      const serviceSpy = jest.spyOn(manifestService, 'delete').mockReturnValue(of(undefined));

      actions$ = hot('--a-', {
        a: DashboardActions.deleteManifest({ id: 'a' })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.fetchManifestsList()
      });
      expect(effects.deleteManifest$).toBeObservable(expected$);
      expect(effects.deleteManifest$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenCalledWith('a');
      });
    });
  });

  describe('followManifestRoute$', () => {
    it('should call follow', () => {
      const serviceSpy = jest.spyOn(router, 'navigateByUrl').mockReturnValue(Promise.resolve(true));

      actions$ = hot('--a-', {
        a: DashboardActions.followManifestRoute()
      });

      const expected$ = hot('--a-', {
        a: [DashboardActions.followManifestRoute(), { route: 'a' }]
      });
      expect(effects.followManifestRoute$).toBeObservable(expected$);
      expect(effects.followManifestRoute$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenCalledWith('a');
      });
    });
  });

  describe('fetchObjectsDetails$', () => {
    it('should fetch all requested objects', () => {
      const serviceSpy = jest.spyOn(itemService, 'get').mockImplementation((id) => of({ id, oClass: 'gen' } as Item));

      actions$ = hot('--a-', {
        a: DashboardActions.fetchObjectsDetails({ ids: ['aaa', 'bbb', 'ddd'] })
      });

      const expected$ = hot('--(abc)-', {
        a: DashboardActions.updateObjectsDetails({ list: { aaa: { id: 'aaa', oClass: 'gen' } as Item } }),
        b: DashboardActions.updateObjectsDetails({ list: { bbb: { id: 'bbb', oClass: 'gen' } as Item } }),
        c: DashboardActions.updateObjectsDetails({ list: { ddd: { id: 'ddd', oClass: 'gen' } as Item } })
      });
      expect(effects.fetchObjectsDetails$).toBeObservable(expected$);
      expect(effects.fetchObjectsDetails$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenNthCalledWith(1, 'aaa');
        expect(serviceSpy).toHaveBeenNthCalledWith(2, 'bbb');
        expect(serviceSpy).toHaveBeenNthCalledWith(3, 'ddd');
      });
    });
  });

  describe('proximitySearch$', () => {
    it('should merge returned resultsets', () => {
      const serviceSpy = jest.spyOn(itemService, 'proximity').mockImplementation((id) =>
        of({
          items: { classB: [{ id: 'bbb', oClass: 'classB', attributes: {} }] },
          relations: []
        } as ResultSet)
      );

      DashboardSelectors.resultSets.setResult({
        rs: {
          items: { classA: [{ id: 'aaa', oClass: 'classA', attributes: {} }] },
          relations: []
        },
        b: { items: {}, relations: [] }
      });

      actions$ = hot('--a-', {
        a: DashboardActions.proximity({ id: 'aaa', targetResultSet: 'rs' })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.updateResultSet({
          id: 'rs',
          resultSet: {
            items: {
              classA: [{ id: 'aaa', oClass: 'classA', attributes: {} }],
              classB: [{ id: 'bbb', oClass: 'classB', attributes: {} }]
            },
            relations: [],
            count: {}
          }
        })
      });
      expect(effects.proximitySearch$).toBeObservable(expected$);
      expect(effects.proximitySearch$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenNthCalledWith(1, 'aaa');
      });
    });

    it('should only keep one object of each id', () => {
      const serviceSpy = jest.spyOn(itemService, 'proximity').mockImplementation((id) =>
        of({
          items: {
            classB: [
              { id: 'bbb', oClass: 'classB', attributes: {} },
              { id: 'ccc', oClass: 'classB', attributes: {} }
            ]
          },
          relations: [],
          count: {
            classB: { count: 3, accurate: true }
          }
        } as ResultSet)
      );

      DashboardSelectors.resultSets.setResult({
        rs: {
          items: {
            classA: [{ id: 'aaa', oClass: 'classA', attributes: {} }],
            classB: [{ id: 'bbb', oClass: 'classB', attributes: {} }]
          },
          relations: [],
          count: {
            classA: { count: 5, accurate: true },
            classB: { count: 5, accurate: false }
          }
        }
      });

      actions$ = hot('--a-', {
        a: DashboardActions.proximity({ id: 'aaa', targetResultSet: 'rs' })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.updateResultSet({
          id: 'rs',
          resultSet: {
            items: {
              classA: [{ id: 'aaa', oClass: 'classA', attributes: {} }],
              classB: [
                { id: 'bbb', oClass: 'classB', attributes: {} },
                { id: 'ccc', oClass: 'classB', attributes: {} }
              ]
            },
            relations: [],
            count: {
              classA: { count: 5, accurate: true },
              classB: { count: 8, accurate: false }
            }
          }
        })
      });
      expect(effects.proximitySearch$).toBeObservable(expected$);
      expect(effects.proximitySearch$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenNthCalledWith(1, 'aaa');
      });
    });

    it('should only keep one relation of each', () => {
      const serviceSpy = jest.spyOn(itemService, 'proximity').mockImplementation((id) =>
        of({
          items: {},
          relations: [
            { relationType: 'a', source: 'a', destination: 'a' },
            { relationType: 'b', source: 'a', destination: 'a' }
          ]
        } as unknown as ResultSet)
      );

      DashboardSelectors.resultSets.setResult({
        rs: {
          items: {},
          relations: [
            { relationType: 'a', source: 'a', destination: 'a' },
            { relationType: 'a', source: 'c', destination: 'a' }
          ]
        } as unknown as ResultSet
      });

      actions$ = hot('--a-', {
        a: DashboardActions.proximity({ id: 'aaa', targetResultSet: 'rs' })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.updateResultSet({
          id: 'rs',
          resultSet: {
            items: {},
            relations: [
              { relationType: 'a', source: 'a', destination: 'a' },
              { relationType: 'b', source: 'a', destination: 'a' },
              { relationType: 'a', source: 'c', destination: 'a' }
            ],
            count: {}
          } as unknown as ResultSet
        })
      });
      expect(effects.proximitySearch$).toBeObservable(expected$);
      expect(effects.proximitySearch$).toSatisfyOnFlush(() => {
        expect(serviceSpy).toHaveBeenNthCalledWith(1, 'aaa');
      });
    });
  });
});
