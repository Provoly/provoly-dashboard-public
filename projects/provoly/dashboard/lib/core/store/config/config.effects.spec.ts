import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  Aggregation,
  ChartOption,
  ConfigActions,
  ConfigSelectors,
  MarkSubType,
  MarkType,
  VegaColorType,
  Widget
} from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { PrySnackbarService } from '../../../core/components/snackbar/snackbar.service';
import { PryI18nService } from '../../../core/i18n/i18n.service';
import { ConfigEffects } from './config.effects';
import {
  ConfigService,
  ParamContent,
  SYMBOL_DOMAIN,
  TABLE_ATTR_DOMAIN,
  TILE_ATTR_DOMAIN,
  TOOLTIPS_DOMAIN
} from './config.service';
import { OpenMapTilesService } from './open-map-tiles.service';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

let mapStyles: { identifier: string; label: string }[] = [
  { identifier: '1', label: 'terrain-map' },
  { identifier: '2', label: 'road-map' }
];

let tooltipDefinition = {
  type: 'default'
};

let iconDefinitions = [{ iconUrl: 'test.png', iconSize: [25, 25] }];

let paramContent: ParamContent[] = [
  { domain: SYMBOL_DOMAIN, oClass: 'class-1', content: JSON.stringify(iconDefinitions) },
  { domain: TABLE_ATTR_DOMAIN, oClass: 'class-2', content: '["test 2"]' },
  { domain: TOOLTIPS_DOMAIN, oClass: 'class-3', content: JSON.stringify(tooltipDefinition) },
  { domain: TILE_ATTR_DOMAIN, oClass: 'class-4', content: '["test 4"]' }
];

const widget: Widget = {
  id: '1',
  name: 'Restitution',
  description: '',
  content:
    '{"type":"tile","layout":{"x":1,"y":1,"width":1,"height":1},"options":{},"namedQuery":["39061554-298f-4f56-8cd2-51ccec998307"]}',
  image: 'internal:weather.png',
  datasource: [],
  modificationDate: '',
  groups: []
};

const chartOption: ChartOption = {
  type: [MarkType.ARC],
  subType: { arc: [MarkSubType.DONUT] },
  aggregation: [Aggregation.NONE],
  color: [VegaColorType.CATEGORY10, VegaColorType.CATEGORY20]
};

describe('ConfigEffects', () => {
  let actions$: Observable<any>;
  let effects: ConfigEffects;
  let configService: ConfigService;
  let openMapTilesService: OpenMapTilesService;
  let store: MockStore<any>;
  let snackbarService: PrySnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigEffects,
        provideMockStore({}),
        provideMockActions(() => actions$),
        {
          provide: OpenMapTilesService,
          useValue: {
            getStyles: () => of([...mapStyles])
          }
        },
        {
          provide: ConfigService,
          useValue: {
            saveDefinitions: () => of(''),
            getAllClassParams: () => of(paramContent),
            getAllWidgets: () => of([widget, { ...widget, id: '2' }]),
            saveWidget: () => of(''),
            deleteRestitution: () => of('')
          }
        },
        { provide: PryI18nService, useClass: MockPryI18nService },
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => {}
          }
        }
      ]
    });

    effects = TestBed.inject(ConfigEffects);
    configService = TestBed.inject<ConfigService>(ConfigService);
    openMapTilesService = TestBed.inject<OpenMapTilesService>(OpenMapTilesService);
    snackbarService = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
    store.overrideSelector(ConfigSelectors.chartOption, chartOption);
    store.overrideSelector(ConfigSelectors.mapStyles, []);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should get map styles', () => {
    const spy = jest.spyOn(openMapTilesService, 'getStyles');

    actions$ = hot('a', {
      a: ConfigActions.getMapStyles()
    });

    const expected$ = hot('a', {
      a: ConfigActions.defineMapStyles({ styles: mapStyles })
    });

    expect(effects.mapStyles$).toBeObservable(expected$);
    expect(effects.mapStyles$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should save icon definitions', () => {
    const spy = jest.spyOn(configService, 'saveDefinitions');

    actions$ = hot('a', {
      a: ConfigActions.saveIcons({
        definitions: {
          'icon-1': [
            {
              iconUrl: 'test.png',
              iconSize: [25, 25]
            }
          ]
        }
      })
    });

    const expected$ = hot('a', {
      a: ConfigActions.loadCustomization()
    });

    expect(effects.saveIconDefinitions$).toBeObservable(expected$);
    expect(effects.saveIconDefinitions$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should save default table attributes', () => {
    const spy = jest.spyOn(configService, 'saveDefinitions');

    actions$ = hot('a', {
      a: ConfigActions.saveTableDefaultAttributes({
        definitions: {
          'class-id': ['attr-1', 'attr-2']
        }
      })
    });

    const expected$ = hot('a', {
      a: ConfigActions.loadCustomization()
    });

    expect(effects.saveTableAttributes$).toBeObservable(expected$);
    expect(effects.saveTableAttributes$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should save default tile attributes', () => {
    const spy = jest.spyOn(configService, 'saveDefinitions');

    actions$ = hot('a', {
      a: ConfigActions.saveTileAttributes({
        definitions: {
          'class-id': ['attr-1', 'attr-2']
        }
      })
    });

    const expected$ = hot('a', {
      a: ConfigActions.loadCustomization()
    });

    expect(effects.saveTileAttributes$).toBeObservable(expected$);
    expect(effects.saveTileAttributes$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should save templates', () => {
    const spy = jest.spyOn(configService, 'saveDefinitions');

    actions$ = hot('a', {
      a: ConfigActions.saveTooltip({
        definitions: {
          'class-id': {
            type: 'default'
          }
        }
      })
    });

    const expected$ = hot('a', {
      a: ConfigActions.loadCustomization()
    });

    expect(effects.saveTemplates$).toBeObservable(expected$);
    expect(effects.saveTemplates$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  /* it('should get customization', () => {
    const spy = jest.spyOn(configService, 'getAllClassParams');

    actions$ = hot('a', {
      a: ConfigActions.loadCustomization()
    });

    const expected$ = hot('a', {
      a: ConfigActions.loadedCustomization({
        icons: {
          'class-1': [
            {
              iconUrl: 'test.png',
              iconSize: [25, 25]
            }
          ]
        },
        tooltips: {
          'class-3': {
            type: 'default'
          }
        },
        filters: {},
        tableAttributes: {
          'class-2': ['test 2']
        },
        tileAttributes: {
          'class-4': ['test 4']
        }
      })
    });

    expect(effects.getCustomization$).toBeObservable(expected$);
    expect(effects.getCustomization$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should save widget in catalog', () => {
    const spy = jest.spyOn(configService, 'saveWidget');

    actions$ = hot('a', {
      a: ConfigActions.saveWidget({ widget: { ...widget, id: '3' } })
    });

    const expected$ = hot('a', {
      a: ConfigActions.loadWidgets()
    });

    expect(effects.saveWidget$).toBeObservable(expected$);
    expect(effects.saveWidget$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  }); */

  it('should delete widget from catalog', () => {
    const spy = jest.spyOn(configService, 'deleteRestitution');

    actions$ = hot('a', {
      a: ConfigActions.deleteRestitution({ id: '1' })
    });

    const expected$ = hot('a', {
      a: ConfigActions.loadWidgets()
    });

    expect(effects.deleteRestitution$).toBeObservable(expected$);
    expect(effects.deleteRestitution$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should load widgets in catalog', () => {
    const spy = jest.spyOn(configService, 'getAllWidgets');

    actions$ = hot('--a-', {
      a: ConfigActions.loadWidgets()
    });

    const expected$ = hot('--a-', {
      a: ConfigActions.loadedWidgets({
        widgets: [widget, { ...widget, id: '2' }]
      })
    });
    expect(effects.loadWidget$).toBeObservable(expected$);
    expect(effects.loadWidget$).toSatisfyOnFlush(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should load chart options', () => {
    actions$ = hot('--a-', {
      a: ConfigActions.loadChartOption()
    });

    const expected$ = hot('--a-', {
      a: ConfigActions.loadedChartOption({
        chartOption: chartOption
      })
    });
    expect(effects.loadChartOption$).toBeObservable(expected$);
  });
});
