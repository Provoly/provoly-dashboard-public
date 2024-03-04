import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AggregationResult,
  Attribute,
  BaseTooltipComponent,
  BaseWidgetMapLayerOptions,
  ChartAggregatedWidgetOptions,
  Class,
  ClassSelectors,
  ConfigSelectors,
  DashboardActions,
  DashboardSelectors,
  Dataset,
  DataSourceSelectors,
  DatasourceUtils,
  DataWidgetComponent,
  Field,
  FieldSelectors,
  FilterContext,
  GeoMetadata,
  GeometricFieldTypes,
  GetCapabilitiesResponse,
  ItemUtils,
  MapAutoLayerOptions,
  MapFeatureLayerOptions,
  MapGeoServerLayerOptions,
  MapRasterTileLayerOptions,
  MapVectorTileLayerOptions,
  MapWidgetBubbleLayerOptions,
  MapWidgetHeatMapLayerOptions,
  MapWidgetLayerOptions,
  MapWidgetMarkerLayerOptions,
  MapWidgetOptions,
  MapWMSLayerLayerOptions,
  MapWMTSLayerLayerOptions,
  NamedQueryTypes,
  Operation,
  PRY_GEOAUTH_TOKEN,
  PryAggregationService,
  PryGeoAuthService,
  PryI18nService,
  ResultsetUtils,
  SymbolService,
  TooltipFactoryService,
  TooltipMode,
  WIDGET_HEADER_HEIGHT,
  widgetMapConfig
} from '@provoly/dashboard';
import equal from 'fast-deep-equal/es6';
import { Feature, Map, Overlay, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { boundingExtent, createEmpty } from 'ol/extent';
import { Circle, Geometry, Point } from 'ol/geom';
import { Heatmap, Layer, Tile } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import { Pixel } from 'ol/pixel';
import { fromLonLat } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import { DataTile, ImageWMS, TileWMS } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';
import proj4 from 'proj4';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  of,
  startWith,
  Subscription,
  switchMap,
  withLatestFrom
} from 'rxjs';
import { InteractionManager } from '../interaction/interaction-manager.class';
import { CqlUtils } from '../utils/cql-utils.class';
import { XMLUtils } from '../utils/xml-utils.class';
import { WidgetMapLayerService } from './widget-map-layer.service';
import MapboxVectorLayer from 'ol/layer/MapboxVector';
import { WidgetMapUtils } from '../utils/widget-map.utils';
import { LayerSlider } from '../interaction/layer-slider.class';
import TileLayer from 'ol/layer/Tile';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import { Attribution, defaults } from 'ol/control';
import VectorTileLayer from 'ol/layer/VectorTile';

export const TOOLTIP_PADDING = 15;
export const NON_MANDATORY_FIT_LAYER_TYPES = ['wms', 'geoserver'];

// Define Lambert Projection
proj4.defs(
  'EPSG:2154',
  '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);
register(proj4);

@Component({
  selector: 'pry-widget-map',
  templateUrl: './widget-map.component.html'
})
export class WidgetMapComponent extends DataWidgetComponent implements AfterViewInit, OnDestroy {
  mapUrl$: Observable<string>;
  @ViewChild('mapRef') mapRef!: ElementRef;
  @ViewChild('popup') popup!: ElementRef;
  @ViewChild('popupContent', { read: ViewContainerRef }) popupContent!: ViewContainerRef;
  @ViewChild('exportTypeTemplate', { read: TemplateRef }) exportTypeTemplate!: TemplateRef<any>;
  @ViewChild('sliderElement') sliderElement!: ElementRef<HTMLInputElement>;
  options$: Observable<MapWidgetOptions>;
  layerTypes = this.widgetMapLayerService.implementationList
    .filter((type) => type !== 'auto')
    .sort((a, b) =>
      this.translateService
        .instant('@pry.widget.map.layerType.' + a)
        .localeCompare(this.translateService.instant('@pry.widget.map.layerType.' + b))
    );
  optionsCopy: MapWidgetOptions = {} as MapWidgetOptions;
  classes$: Observable<Class[]>;
  fields$: Observable<Field[]>;
  selectedIds$: Observable<string[]>;
  bottomLeft$: Observable<string>;
  layers$!: Observable<BaseLayer[]>;
  map!: Map;
  additionalLayers$ = new BehaviorSubject<VectorLayer<VectorSource<Geometry>>[]>([]);
  styles$: Observable<
    {
      identifier: string;
      label: string;
    }[]
  >;
  WIDGET_HEADER_HEIGHT = WIDGET_HEADER_HEIGHT;
  i = 0;
  itemStyles$!: Observable<{
    [id: string]: {
      classic: Style;
      bordered: Style;
    };
  }>;
  height$: Observable<number>;
  actions$ = widgetMapConfig.actions$;
  private wmsFeatures$: Observable<any[]>;
  classicFeatures$: BehaviorSubject<any> = new BehaviorSubject([]);
  geoServerLayerDescriptions$: Observable<MapGeoServerLayerOptions[]>;
  legendTabOpen = false;
  layersTabOpen = false;
  legendTab = 0;
  legendLayers$!: Observable<(MapGeoServerLayerOptions | MapWMSLayerLayerOptions)[]>;
  legendTop$: Observable<number>;
  layersTop$!: Observable<number>;
  legendHeight$: Observable<number>;
  imageNotProvided: boolean[] = [];
  basicActions$: Observable<('click' | 'lasso' | 'rectangle' | 'zoom' | 'move' | 'export' | 'upload')[]>;
  zoomAndCenter$ = new BehaviorSubject<{
    zoom?: {
      start: number;
      min: number;
      max: number;
    };
    center?: number[];
  }>({});
  mapStyleUrl$!: Observable<string | null>;
  interactionManager: InteractionManager = new InteractionManager();
  mapStyleLayer$!: Observable<(VectorTileLayer | TileLayer<any>)[]>;
  tooltipIndex = 0;
  tooltipNumber = 0;
  STYLE_FROM_URL = '_url';
  NO_STYLE = 'none';
  wmsCapabilities$: Observable<
    | {
        [p: string]: GetCapabilitiesResponse | null;
      }
    | undefined
  >;
  autoDatasetLayers$: Observable<MapAutoLayerOptions[]>;
  fitExtents$!: Observable<
    {
      datasource: string;
      extent: Coordinate[];
      error: boolean;
    }[]
  >;
  datasourceFilters$: Observable<any>;
  usedClasses$: Observable<any>;
  layerSlider = new LayerSlider();
  hasSlideLayer$: Observable<boolean>;
  slides: { id: undefined | string; label: string }[];
  possibleStyles: {
    [p: string]: {
      layers: { [p: string]: { param: string; styles: { id: string; label: string }[] } } | null;
      url: string;
    };
  } = {};
  attributions = new Attribution();
  actionMenuOpen$ = new BehaviorSubject(false);
  attributions$: Observable<boolean>;
  olZoomElement$ = new BehaviorSubject<HTMLDivElement | null>(null);
  previousLayers: BaseLayer[] = [];
  previousTooltip?: ComponentRef<BaseTooltipComponent>;
  previousTooltipSub?: Subscription;
  popupOverlay?: Overlay;

  constructor(
    store: Store<any>,
    public translateService: PryI18nService,
    private tooltipFactoryService: TooltipFactoryService,
    private symbolService: SymbolService,
    private injector: Injector,
    private widgetMapLayerService: WidgetMapLayerService,
    private pryAggregationService: PryAggregationService,
    el: ElementRef,
    @Optional() @Inject(PRY_GEOAUTH_TOKEN) private geoAuthService: PryGeoAuthService
  ) {
    super(store, el);

    this.getOlZoomElement();

    this.slides = [
      { id: 'all', label: this.translateService.instant('@pry.widget.map.slide.all') },
      { id: 'left', label: this.translateService.instant('@pry.widget.map.slide.left') },
      { id: 'right', label: this.translateService.instant('@pry.widget.map.slide.right') }
    ];

    this.widgetMapLayerService.withGeoAuth(this.geoAuthService);

    this.basicActions$ = combineLatest([
      this.actions$,
      this.actionMenuOpen$,
      this.interactionManager.selectionInteraction.selectionType$
    ]).pipe(
      map(([actions, menuOpen, selectionType]) =>
        menuOpen
          ? actions.filter((action) => action !== 'export' && action !== 'upload')
          : actions
              .filter((action) => action !== 'export' && action !== 'upload')
              .filter((action) => selectionType === action)
      )
    );

    this.classes$ = this.store
      .select(ClassSelectors.classes)
      .pipe(map((classes) => classes.sort((a, b) => a.name.localeCompare(b.name))));
    this.usedClasses$ = combineLatest([this.classes$, this.usedDatasources$]).pipe(
      map(([classes, datasources]) => {
        return classes.filter((classItem) =>
          datasources.some((dataSource) => {
            if (dataSource.sourceType === 'namedQuery' && 'type' in dataSource.request) {
              if (
                dataSource.request.type === NamedQueryTypes.MULTI_CLASS ||
                dataSource.request.type === NamedQueryTypes.FULL_TEXT
              ) {
                return true;
              }
            }
            return dataSource.sourceType === 'dataset'
              ? dataSource.oClass === classItem.id
              : dataSource.sourceType === 'namedQuery' && 'oClass' in dataSource.request
              ? dataSource.request.oClass === classItem.id
              : dataSource.sourceType === 'namedQuery' && 'type' in dataSource.request
              ? dataSource.request.type === NamedQueryTypes.MONO_CLASS
              : false;
          })
        );
      })
    );
    this.fields$ = this.store.select(FieldSelectors.fields);

    this.datasourceFilters$ = combineLatest([
      this.store.select(DashboardSelectors.datasourceFilters),
      this.datasourceIds$
    ]).pipe(
      map(
        ([filters, ids]) =>
          Object.keys(filters)
            .filter((filterDsKey) => ids.includes(filterDsKey))
            .reduce((p, c) => ({ ...p, [c]: filters[c] }), {}) as {
            [p: string]: FilterContext[];
          }
      ),
      distinctUntilChanged((p, c) => equal(p, c))
    );

    this.styles$ = this.store.select(ConfigSelectors.mapStyles).pipe(
      map((styles) =>
        styles.concat(
          {
            identifier: this.NO_STYLE,
            label: this.translateService.instant('@pry.widget.map.noStyle')
          },
          {
            identifier: this.STYLE_FROM_URL,
            label: this.translateService.instant('@pry.widget.map.styleFromUrl')
          }
        )
      )
    );
    this.selectedIds$ = this.store.select(DashboardSelectors.selectedItemIds);

    this.geoServerLayerDescriptions$ = combineLatest([
      this.usedDatasources$.pipe(
        startWith([]),
        distinctUntilChanged((p, c) => equal(p, c))
      ),
      this.store.select(ConfigSelectors.geoServerUrl).pipe(startWith(undefined))
    ]).pipe(
      debounceTime(100),
      map(([dataSources, geoServerUrl]) => {
        if (!geoServerUrl) return [];
        return dataSources
          .filter((ds) => DatasourceUtils.isGeo(ds))
          .map((ds) => {
            ds = ds as unknown as Dataset;
            const metadatas: {
              [key: string]: string;
            } = {};
            ds.metadata?.forEach((m) => (metadatas[m.metadataDef.name] = m.value));
            return {
              type: 'geoserver',
              url: `${geoServerUrl}/${
                metadatas[GeoMetadata.NAMESPACE].length > 0 ? metadatas[GeoMetadata.NAMESPACE] + '/' : ''
              }wms?SERVICE=WMS&VERSION=1.3.0`,
              paramTiled: true,
              opacity: parseInt(metadatas[GeoMetadata.OPACITY] ?? 100, 10),
              oClass: ds.oClass,
              key: metadatas[GeoMetadata.NAMESPACE] + ':' + metadatas[GeoMetadata.KEY],
              namespace: metadatas[GeoMetadata.NAMESPACE],
              paramLayer: metadatas[GeoMetadata.KEY],
              name: ds.name,
              datasourceId: ds.id
            };
          })
          .map((layer) => layer as MapGeoServerLayerOptions);
      }),
      distinctUntilChanged((p, c) => equal(p, c)),
      startWith([])
    );

    this.autoDatasetLayers$ = combineLatest([
      this.classes$,
      this.fields$,
      this.usedDatasources$.pipe(
        startWith([]),
        map(
          (datasources) =>
            datasources.filter((ds) => ds.sourceType === 'dataset' && !DatasourceUtils.isGeo(ds)) as Dataset[]
        )
      )
    ]).pipe(
      map(
        ([classes, fields, dataSets]) =>
          dataSets
            .map((ds) => {
              const model = classes.find((clazz) => clazz.id === ds.oClass);
              const geoAttributes = (
                model?.attributes.map((attr) => ({ attr, field: fields.find((f) => attr.field === f.id) })) ?? []
              ).filter(({ attr, field }) => !!field && GeometricFieldTypes.includes(field.type));
              return geoAttributes.map(
                (geo) =>
                  ({
                    type: 'auto',
                    title: `${ds.name}${geoAttributes.length > 1 ? ' - ' + geo.attr.name : ''}`,
                    oClass: ds.oClass,
                    key: ds.id,
                    subType: geo.field!.type,
                    classes: [ds.oClass],
                    attribute: geo.attr.technicalName
                  } as MapAutoLayerOptions)
              );
            })
            .flat() as MapAutoLayerOptions[]
      )
    );

    this.subscriptions.add(
      this.manifest$
        .pipe(
          map((manifest) =>
            (
              (((manifest.options ?? { layers: [] }) as MapWidgetOptions).layers ?? []).filter((layer) =>
                ['wms'].includes(layer.type)
              ) as MapWMSLayerLayerOptions[]
            ).map((layer) => layer.url)
          )
        )
        .subscribe((urls) => urls.forEach((url) => this.store.dispatch(DashboardActions.getCapability({ url }))))
    );

    this.wmsCapabilities$ = this.store.select(DashboardSelectors.capabilities);

    this.options$ = combineLatest([
      this.manifest$,
      this.resultSet$,
      this.classes$,
      this.fields$,
      this.styles$,
      this.geoServerLayerDescriptions$,
      this.wmsCapabilities$,
      this.autoDatasetLayers$
    ]).pipe(
      map(([manifest, resultSet, classes, fields, mapStyles, geoLayers, capabilities, autoDatasetLayers]) => {
        // auto determine layers parameters to provide a working view
        const autoOptions = JSON.parse(JSON.stringify(manifest.options ?? {})) as MapWidgetOptions;
        if (!autoOptions.tooltipMode) {
          autoOptions.tooltipMode = TooltipMode.CLICK;
        }

        autoOptions.layers = [
          ...(autoOptions.layers ?? []).filter((layer) => layer.type !== 'auto'),
          ...(autoOptions.automaticLayers
            ? autoDatasetLayers
                .filter(
                  (layer) =>
                    !autoOptions.ignoreAutoLayer ||
                    !autoOptions.ignoreAutoLayer.includes(layer.key + '-' + layer.subType)
                )
                .map((layer) => ({
                  ...layer,
                  ...((autoOptions.layers ?? []).find(
                    // @ts-ignore
                    (prevLayer) => prevLayer.key === layer.key && prevLayer.attribute === layer.attribute
                  ) ?? {})
                }))
            : [])
        ];

        autoOptions.layers?.forEach((layer, i) => {
          WidgetMapUtils.populateLocationAttribute(layer, resultSet, classes, fields);
          WidgetMapUtils.populateIntensityAttribute(layer, resultSet, classes, fields);
          if (autoOptions.attributions) {
            layer.attribution = layer.attribution ?? '';
          }
        });

        const actualLayerKeys = (autoOptions.layers ?? [])
          .map((layer) => (layer as MapGeoServerLayerOptions).key ?? null)
          .filter((key) => !!key);

        // Get all previous layers, without geoserver layers that are not requested anymore, then add new geoserver layers (potentially with a preconfig from manifest).
        autoOptions.layers = [
          ...(autoOptions.layers ?? []).map((layer) => {
            // @ts-ignore
            const geoLayer = geoLayers.find((geoLayer) => layer.key === geoLayer.key) ?? null;
            return layer.type === 'geoserver'
              ? geoLayer
                ? { ...geoLayer, ...layer, url: geoLayer.url }
                : (null as unknown as MapWidgetLayerOptions)
              : { ...layer };
          }),
          ...geoLayers.filter((layer) => !actualLayerKeys.includes(layer.key))
        ].filter((layer) => !!layer);

        autoOptions.layers.forEach((layer) => {
          this.setDefaultLayerTitle(layer, capabilities);
        });

        if (
          !!mapStyles &&
          mapStyles.length > 0 &&
          (!autoOptions.style || !mapStyles.map((style) => style.identifier).includes(autoOptions.style))
        ) {
          const lightStyles = mapStyles.filter((style) => !(style.identifier ?? '-').includes('dark'));
          autoOptions.style = lightStyles.length > 0 ? lightStyles[0].identifier : mapStyles[0].identifier;
        }

        if (autoOptions.ignoreAutoLayer) {
          const base = autoOptions.ignoreAutoLayer;

          // Remove from ignoreAutoLayers, values that are not necessary
          const possibleIgnoreAutoLayerKeys = autoDatasetLayers.map((layer) => layer.key + '-' + layer.subType);
          autoOptions.ignoreAutoLayer = (autoOptions.ignoreAutoLayer ?? []).filter((key) =>
            possibleIgnoreAutoLayerKeys.includes(key)
          );
          if (autoOptions.ignoreAutoLayer.length === 0) {
            delete autoOptions.ignoreAutoLayer;
          }

          if (!autoOptions.ignoreAutoLayer || base.length !== autoOptions.ignoreAutoLayer.length) {
            this.emitManifest();
          }
        }

        autoOptions.layers = WidgetMapUtils.assignLayersOrder(autoOptions.layers);

        if (autoOptions.fit !== undefined) {
          autoOptions.layers.forEach(
            (layer) => (layer.fit = !NON_MANDATORY_FIT_LAYER_TYPES.includes(layer.type) || autoOptions.fit)
          );
          delete autoOptions.fit;
        }

        [
          ...new Set(
            (
              autoOptions.layers.filter((layer) => ['wms', 'geoserver'].includes(layer.type)) as (
                | MapWMSLayerLayerOptions
                | MapGeoServerLayerOptions
              )[]
            ).map((layer) => layer.url)
          )
        ].forEach((url) => {
          if (capabilities && capabilities[url] === undefined) {
            this.store.dispatch(DashboardActions.getCapability({ url: url }));
          }
        });

        return autoOptions;
      }),
      distinctUntilChanged((p, c) => equal(p, c))
    );

    this.subscriptions.add(
      this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
        this.optionsCopy = JSON.parse(JSON.stringify(options));
      })
    );

    this.mapUrl$ = this.store.select(ConfigSelectors.mapUrl);
    this.wmsFeatures$ = this.store.select(DashboardSelectors.wmsFeatures);

    this.bottomLeft$ = this.widgetSize$.pipe(
      map((size) => `translate(10px ,calc(${size.height}px - 100% - 10px))`),
      delay(10)
    );

    this.itemStyles$ = combineLatest([this.resultSet$, this.manifest$, this.staticResultSet$]).pipe(
      mergeMap(([rs, manifest, srs]) => {
        if ((manifest.datasource === undefined || manifest.datasource.length === 0) && !srs) {
          return of({});
        } else {
          return from(
            new Promise<{
              [id: string]: {
                classic: Style;
                bordered: Style;
              };
            }>((resolve, reject) => {
              const total = Object.values(rs.items).reduce((p, c) => c.length + p, 0);
              if (total === 0) resolve({});
              const result = {} as {
                [id: string]: {
                  classic: Style;
                  bordered: Style;
                };
              };
              Object.values(rs.items).forEach((items) => {
                items.forEach((item) =>
                  Promise.all([
                    this.symbolService.getSymbolAsIconStyle(item),
                    this.symbolService.getSymbolAsIconStyle(item, true)
                  ]).then(([style, bStyle]) => {
                    result[item.id] = { classic: style, bordered: bStyle };
                    if (Object.keys(result).length >= total) {
                      resolve(result);
                    }
                  })
                );
              });
            })
          );
        }
      })
    );

    this.height$ = combineLatest([this.widgetSize$.pipe(debounceTime(100)), this.displayHeader$]).pipe(
      map(([size, display]) => (size.height ?? 100) - (display ? WIDGET_HEADER_HEIGHT : 0)),
      delay(10)
    );

    this.attributions$ = this.options$.pipe(map((options) => !!options.attributions));

    this.legendTop$ = combineLatest([this.displayHeader$, this.attributions$]).pipe(
      map(([header, attr]) => 5 + (header ? WIDGET_HEADER_HEIGHT : 0) + (attr ? 61 : 0))
    );

    this.legendHeight$ = combineLatest([this.widgetSize$.pipe(debounceTime(100)), this.legendTop$]).pipe(
      map(([size, top]) => {
        return (size.height ?? 100) - WIDGET_HEADER_HEIGHT - top - 56; // 56px is the tooltip height + margin
      }),
      delay(10)
    );

    this.subscriptions.add(
      this.wmsCapabilities$
        .pipe(
          map((wmsCapabilities) =>
            wmsCapabilities
              ? Object.keys(wmsCapabilities)
                  .map((url) => ({ url, layers: XMLUtils.getPossibleLayerStyles(wmsCapabilities[url]?.doc) }))
                  .reduce((p, c) => ({ ...p, [c.url]: c }), {})
              : {}
          ),
          startWith({})
        )
        .subscribe((possibleStyles) => (this.possibleStyles = possibleStyles))
    );

    this.hasSlideLayer$ = this.options$.pipe(
      map((options) =>
        (options.layers ?? []).map((layer) => !!layer.slide && layer.slide !== 'all').reduce((a, b) => a || b, false)
      )
    );
  }

  initInteractionManager() {
    return this.interactionManager.init(this);
  }

  ngAfterViewInit(): void {
    this.map = new Map({ target: this.mapRef.nativeElement, controls: defaults({ attribution: false }) });
    this.interactionManager = this.initInteractionManager();
    this.layerSlider.init(this.map, this.sliderElement.nativeElement);
    this.mapStyleUrl$ = combineLatest([this.options$, this.mapUrl$]).pipe(
      map(([options, url]) => {
        switch (options.style) {
          case this.NO_STYLE:
            return null;
          case this.STYLE_FROM_URL:
            return options.styleURL ?? '';
          default:
            return `${url}/styles/${options.style}/style.json`;
        }
      }),
      distinctUntilChanged()
    );

    this.mapStyleLayer$ = this.mapStyleUrl$.pipe(
      map((styleUrl) => {
        if (!styleUrl) {
          return [];
        }
        return [
          new MapboxVectorLayer({
            properties: { title: 'background' },
            styleUrl
          }) /* ,
          new TileLayer({
            source: new TileDebug()
          }) */
        ];
      })
    );

    this.subscriptions.add(
      this.options$
        .pipe(
          map((options) => ({
            center: fromLonLat(options.center ?? WidgetMapUtils.DEFAULT_MAP_CENTER),
            maxZoom: options.zoom?.max ?? WidgetMapUtils.DEFAULT_ZOOM_MAX,
            minZoom: options.zoom?.min ?? WidgetMapUtils.DEFAULT_ZOOM_MIN,
            zoom: options.zoom?.start ?? WidgetMapUtils.DEFAULT_ZOOM_START
          })),
          distinctUntilChanged()
        )
        .subscribe((view) => this.map.setView(new View(view)))
    );

    this.subscriptions.add(
      this.options$
        .pipe(
          map((options) => options.attributions),
          distinctUntilChanged()
        )
        .subscribe((attributions) => {
          if (!attributions) {
            this.map.removeControl(this.attributions);
          } else {
            this.map.addControl(this.attributions);
          }
        })
    );

    this.layers$ = combineLatest([
      this.resultSet$,
      this.options$,
      this.classes$,
      this.additionalLayers$,
      this.itemStyles$,
      this.datasourceFilters$,
      this.fields$
    ]).pipe(
      filter(
        ([resultSet, options, classes, additionalLayers, itemStyles, filters, fields]) =>
          !!resultSet && !!options && !!classes && !!fields
      ),
      map(([resultSet, options, classes, additionalLayers, itemStyles, filters, fields]) => {
        let hasRelationLayer = null as unknown as VectorLayer<VectorSource<any>>;

        const layers = (options?.layers || [])
          .filter(
            // @ts-ignore
            (layer) => this.widgetMapLayerService.dontNeedLocation.includes(layer.type) || !!layer.attribute
          )
          .filter(
            // @ts-ignore
            (layer) => this.widgetMapLayerService.dontNeedIntensity.includes(layer.type) || !!layer.intensityAttribute
          )
          .map((layer: MapWidgetLayerOptions, idx, array) => {
            const attributesForClass = Object.keys(resultSet.items)
              .map((classId) => ({
                classId,
                ...this.getAttributesForDrawing(classes, classId, layer)
              }))
              .reduce(
                (p, c) => ({
                  ...p,
                  [c.classId]: c
                }),
                {} as {
                  [key: string]: {
                    intensityAttribute: Attribute;
                    locationAttribute: Attribute;
                  };
                }
              );

            let layerClassesId = classes.map((clazz) => clazz.id);
            if ('classes' in layer && !!layer.classes && layer.classes.length > 0) {
              layerClassesId = layer.classes;
            }

            let range = { min: 0, max: 0 };
            // @ts-ignore
            if (!!layer.intensityAttribute) {
              const values = Object.keys(resultSet.items)
                .map((classId) =>
                  resultSet.items[classId].map((item) =>
                    ItemUtils.getAttributeCalculatedValue(item, attributesForClass[item.oClass].intensityAttribute)
                  )
                )
                .reduce((p, c) => [...p, ...c], [])
                .filter((value) => !!value && typeof value === 'number') as number[];

              range = values.reduce((p, c) => ({ min: Math.min(p.min, c), max: Math.max(p.max, c) }), {
                min: Number.MAX_VALUE,
                max: -Number.MAX_VALUE
              });
            }

            const impl = this.widgetMapLayerService.layersImplementation[layer.type];
            if (!!impl) {
              const resultLayer = impl(
                layer as any,
                attributesForClass,
                layerClassesId,
                resultSet,
                range,
                itemStyles,
                this.map
              );
              resultLayer.set('fit', layer.fit);
              resultLayer.set('type', layer.type);
              resultLayer.set('slide', layer.slide);
              resultLayer.set('order', layer.order);
              const maxLayerOrder = Math.max(...array.map((l) => l.order ?? 0));
              resultLayer.setZIndex((maxLayerOrder + 1) - (layer.order ?? idx));
              if (layer.type === 'relation') {
                hasRelationLayer = resultLayer as unknown as VectorLayer<VectorSource>;
              }
              resultLayer.set('title', layer.title);

              if (layer.type === 'geoserver') {
                const cql_filter = CqlUtils.getCQLParamsFor(layer.datasourceId, filters, classes, fields);

                if (cql_filter) {
                  // Adding CQL query to geoserver layers
                  (resultLayer as Tile<TileWMS>).getSource()!.updateParams({ cql_filter });
                }
              }

              if (layer.slide && layer.slide !== 'all') {
                this.layerSlider.applySlide(
                  layer.slide,
                  resultLayer as unknown as TileLayer<any> | VectorLayer<any> | Heatmap
                );
              }

              return resultLayer;
            } else {
              console.error(`Layer type ${layer.type} is unknown`);
              return null as unknown as BaseLayer;
            }
          })
          .filter((layer) => !!layer);

        if (!!hasRelationLayer) {
          const features = layers
            .filter((layer) => !(layer instanceof Tile))
            .map((layer) =>
              layer
                // @ts-ignore
                .getSource()
                .getFeatures()
                .filter((features: Feature<any>) => !!features.get('id') || !!features.get('features'))
            )
            .reduce((p, c) => [...p, ...c], []);

          resultSet.relations.forEach((relation) => {
            const source = features.find((f: Feature<Point | Circle>) => f.get('id') === relation.source);
            const dest = features.find((f: Feature<Point | Circle>) => f.get('id') === relation.destination);
            if (!!source && !!dest) {
              hasRelationLayer.getSource()?.addFeature(WidgetMapUtils.getLinkFeature(relation, source, dest));
            }
          });
        }
        layers.push(...additionalLayers);

        if (options.singleLayer) {
          layers.forEach((layer, idx) => {
            layer.setVisible(idx === 0);
          });
        }

        /* Resolve bug drawing webgllayer without nothing underneath: add empty layer below */
        const _layers = this.addEmptyWebGlLayerBelowSlideHeatmaps(layers);
        this.previousLayers.push(..._layers);
        return _layers;
      })
    );

    this.fitExtents$ = combineLatest([
      this.options$,
      this.classes$,
      this.fields$,
      this.datasourceFilters$,
      this.wmsCapabilities$
    ]).pipe(
      debounceTime(100),
      switchMap(([options, classes, fields, filters, wmsCapabilities]) =>
        (options.layers ?? []).find((layer) => ['geoserver', 'wms'].includes(layer.type) && layer.fit)
          ? combineLatest([
              ...((options.layers?.filter((layer) => layer.type === 'geoserver') ?? []) as MapGeoServerLayerOptions[])
                .filter((layer) => layer.fit)
                .map((layer: MapGeoServerLayerOptions) =>
                  (
                    classes.find((clazz) => clazz.id === layer.oClass) ?? ({ attributes: [] } as unknown as Class)
                  ).attributes
                    .map((attr) => ({ attr, field: fields.find((field) => field.id === attr.field) }))
                    .filter(({ attr, field }) => GeometricFieldTypes.includes(field?.type ?? '----'))
                    .map(({ attr, field }) =>
                      this.pryAggregationService
                        .aggregate([layer.datasourceId], {
                          ordinate: { operation: Operation.EXTENT, attribute: attr.id, label: attr.name, keep0: false }
                        } as ChartAggregatedWidgetOptions)
                        .pipe(
                          map((extentResponse: AggregationResult) =>
                            WidgetMapUtils.projectExtentAggregationResponse(
                              field!,
                              extentResponse,
                              layer,
                              wmsCapabilities,
                              this.map
                            )
                          ),
                          catchError(() => of({ datasource: layer.datasourceId, extent: [], error: true }))
                        )
                    )
                    .flat()
                )
                .flat(),
              ...((options.layers?.filter((layer) => layer.type === 'wms') ?? []) as MapWMSLayerLayerOptions[])
                .filter((layer) => layer.fit)
                .map((layer: MapWMSLayerLayerOptions) => {
                  const extent = XMLUtils.getLayerExtent(layer.paramLayer, this.map, wmsCapabilities![layer.url]?.doc);
                  return of({
                    datasource: `wms-${layer.paramLayer}`,
                    extent: extent ?? [],
                    error: !extent
                  });
                })
            ])
          : of([])
      ),
      startWith(
        [] as {
          datasource: string;
          extent: Coordinate[];
          error: boolean;
        }[]
      )
    );

    this.legendLayers$ = this.options$.pipe(
      map(
        (options) =>
          (options.layers ?? []).filter((layer) => ['geoserver', 'wms'].includes(layer.type)) as (
            | MapGeoServerLayerOptions
            | MapWMSLayerLayerOptions
          )[]
      ),
      delay(10)
    );

    this.layersTop$ = combineLatest([this.legendTop$, this.legendLayers$]).pipe(
      map(([legendTop, layers]) => legendTop + ((layers.length ?? 0) > 0 ? 50 : 0))
    );
    this.subscriptions.add(
      combineLatest([this.layersTop$, this.legendLayers$, this.olZoomElement$, this.displayHeader$])
        .pipe(withLatestFrom(this.layers$))
        .subscribe(([[layersTop, legend, zoomElement, displayHeader], layers]) => {
          if (zoomElement) {
            zoomElement.style.top = `${
              layersTop +
              ((legend.length ?? 0) > 0 || layers.length > 0 ? 20 : 0) +
              (!displayHeader ? WIDGET_HEADER_HEIGHT : 0)
            }px`;
          }
        })
    );

    this.subscriptions.add(
      combineLatest([
        this.mapStyleLayer$,
        this.layers$,
        this.selectedIds$.pipe(distinctUntilChanged((p, c) => equal(p, c))),
        this.fitExtents$,
        this.datasourceFilters$
      ]).subscribe(([mapStyleLayer, layers, selectedIds, extents, filters]) => {
        const neededCalculatedExtents = layers.filter(
          (layer) => ['geoserver', 'wms'].includes(layer.get('type')) && layer.get('fit')
        ).length;
        const nbCalculatedExtents = extents.filter((extent) => !extent.error).length;

        if (nbCalculatedExtents >= neededCalculatedExtents) {
          setTimeout(() => {
            const toApplyLayers = [...layers, ...mapStyleLayer];
            this.map.setLayers(toApplyLayers);

            this.fitMapForObjects(selectedIds, extents);
            this.map.updateSize();

            this.map
              .getAllLayers()
              .filter((layer) => !(layer instanceof Tile))
              .forEach((layer) => {
                const getFeatures = (layer.getSource() as VectorSource)?.getFeatures;
                if (typeof getFeatures === 'function') {
                  (layer.getSource() as VectorSource)?.getFeatures().forEach((feature: any) => {
                    const type = feature.get('type');
                    if (
                      ['bubble', 'marker', 'point', 'line', 'polygon', 'multi-line', 'multi-polygon'].includes(type)
                    ) {
                      feature.setStyle(
                        feature.get(selectedIds.includes(feature.get('id')) ? 'selectedStyle' : 'classicStyle')
                      );
                    }
                  });
                }
              });
          }, 100);
        } else {
          this.map.setLayers([...mapStyleLayer]);
        }
      })
    );
    this.subscriptions.add(
      combineLatest([this.wmsFeatures$, this.classicFeatures$])
        .pipe(withLatestFrom(this.widgetSize$, this.displayHeader$))
        .subscribe(([[wmsFeatures, classicFeatures], size, header]) => {
          if (this.map) {
            this.tooltipIndex = 0;
            if (this.popupOverlay !== null) {
              this.clearTooltip();
            }
            this.popupOverlay = new Overlay({
              element: this.popup.nativeElement,
              offset: [9, 9]
            });
            this.map.addOverlay(this.popupOverlay);
            this.popupContent.clear();
            const componentPromises = [] as Promise<ComponentRef<BaseTooltipComponent> | null>[];
            wmsFeatures.forEach((value) => {
              componentPromises.push(this.generateTooltip(value));
            });
            classicFeatures.forEach((value: any) => {
              componentPromises.push(this.generateTooltip(value.values));
            });

            Promise.all(componentPromises).then((promises) => {
              const realComponents = promises.filter((component) => !!component);
              this.tooltipNumber = realComponents.length;
              if (realComponents.length <= 0) {
                this.popup.nativeElement.hidden = true;
                this.popupOverlay?.setPosition([-9999999999, -9999999999]);
              } else {
                this.popup.nativeElement.hidden = false;
                // Do not go outside the map
                const rect = {
                  height: 200 + (header ? WIDGET_HEADER_HEIGHT : 0) + TOOLTIP_PADDING,
                  width: 300 + TOOLTIP_PADDING
                };
                let pixel = this.interactionManager.tooltipEvent?.pixel;
                if (!!pixel && pixel[0] + rect.width > size.width) {
                  pixel[0] = size.width - rect.width;
                }
                if (!!pixel && pixel[1] + rect.height > size.height) {
                  pixel[1] = size.height - rect.height;
                }
                setTimeout(() => {
                  this.tooltipMove(0);
                }, 10);
                this.popupOverlay?.setPosition(this.map.getCoordinateFromPixel(pixel ?? [0, 0]));
              }
            });
          }
        })
    );

    window.addEventListener('forceCloseMapTooltip', () => {
      this.clearTooltip();
    });
  }

  clearTooltip() {
    if (this.popupOverlay) this.map?.removeOverlay(this.popupOverlay);
    this.popupContent?.clear();
    this.previousTooltip?.destroy();
    this.previousTooltipSub?.unsubscribe();
  }

  private addEmptyWebGlLayerBelowSlideHeatmaps(layers: BaseLayer[]) {
    const _layers = [];
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      _layers.push(layer);
      if (layer.get('type') === 'heatmap' && layer.get('slide')) {
        const emptyData = new Uint8Array(256 * 256 * 4);
        const emptyLayer = new WebGLTileLayer({
          source: new DataTile({
            loader() {
              return emptyData;
            },
            maxZoom: 0,
            wrapX: true
          })
        });
        _layers.push(emptyLayer);
      }
    }
    return _layers;
  }

  override initResultSet$() {
    return combineLatest([
      this.store.select(DashboardSelectors.resultSets),
      this.datasourceIds$,
      this.staticResultSet$,
      this.store.select(DataSourceSelectors.datasets)
    ]).pipe(
      map(([resultSets, resultSetNamesArray, staticResultSet, definitions]) => {
        if (!!staticResultSet) {
          return staticResultSet;
        }
        const resultSetArray = resultSetNamesArray
          .filter((rsName) => {
            const definition = definitions.find((dsd) => dsd.id === rsName) as Dataset | undefined;
            return !definition || !(definition.metadata ?? []).find((meta) => meta.metadataDef.name === '_geoKey');
          })
          .map((rsName) => resultSets[rsName ?? ''])
          .filter((rsName) => !!rsName);
        return resultSetArray.reduce((rs1, rs2) => ResultsetUtils.mergeResultSets(rs1, rs2), {
          items: {},
          relations: [],
          merged: resultSetArray.length
        });
      }),
      distinctUntilChanged((p, v) => equal(p, v))
    );
  }

  generateTooltip(value: {
    oClass: string;
    coordinates: Pixel;
    values: any;
  }): Promise<ComponentRef<BaseTooltipComponent> | null> {
    return new Promise((resolve) => {
      const component$ = this.tooltipFactoryService.generateTooltip(value.oClass, this.injector, this.popupContent);
      this.previousTooltipSub?.unsubscribe();
      this.previousTooltipSub = component$.subscribe((component) => {
        if (component) {
          if (this.previousTooltip) {
            this.previousTooltip.destroy();
          }
          component.instance.data.item = value;
          component.instance.popup = this.popup;
          resolve(component);
        }
        resolve(null);
      });
    });
  }

  setDefaultLayerTitle(
    layer: MapWidgetLayerOptions,
    capabilities:
      | {
          [p: string]: GetCapabilitiesResponse | null;
        }
      | undefined
  ) {
    if (!layer.title) {
      if (['geoserver', 'wms'].includes(layer.type)) {
        const geoLayer = layer as MapGeoServerLayerOptions | MapWMSLayerLayerOptions;
        const layerCapabilities = capabilities ? capabilities[geoLayer.url] : undefined;

        if (layerCapabilities) {
          const matchingLayer = XMLUtils.getMatchingLayer(geoLayer.paramLayer, layerCapabilities.doc);
          if (matchingLayer) {
            const matchingTitle = XMLUtils.find(matchingLayer.childNodes, 'Title');
            if (matchingTitle) {
              layer.title =
                !!matchingTitle.textContent && matchingTitle.textContent.length > 0
                  ? matchingTitle.textContent
                  : undefined;
            }
          }
        }
      } else {
        layer.title = this.translateService.instant(`@pry.widget.map.layerType.${layer.type}`, { ...layer });
      }
    }
  }

  fitMapForObjects(
    selectedIds?: string[],
    extents: {
      datasource: string;
      extent: Coordinate[];
    }[] = []
  ) {
    let extent = createEmpty();
    const listOfMarkers = [] as any[];

    /* Mandatory fit */
    this.map
      .getAllLayers()
      .filter((layer) => layer.getProperties()['fit'])
      .filter((layer) => !!layer.getSource && !!layer.getSource() && !!(layer.getSource() as VectorSource).getFeatures)
      .forEach((layer) => {
        (layer.getSource() as VectorSource).getFeatures().forEach((feature: any) => {
          const id = feature.get('id');
          if (!selectedIds || selectedIds.length <= 0 || (selectedIds.length > 0 && selectedIds.includes(id))) {
            switch (feature.get('type')) {
              case 'heatpoint':
              case 'point':
              case 'marker':
                listOfMarkers.push(feature.getGeometry().getCoordinates());
                break;
              case 'line':
              case 'link':
                listOfMarkers.push(...feature.getGeometry().getCoordinates());
                break;
              case 'polygon':
              case 'multi-line':
                listOfMarkers.push(...feature.getGeometry().getCoordinates().flat());
                break;
              case 'multi-polygon':
                listOfMarkers.push(...feature.getGeometry().getCoordinates().flat().flat());
                break;
              default:
                listOfMarkers.push(feature.getGeometry().getCenter());
            }
          }
        });
      });

    const selectedExtent = boundingExtent(
      listOfMarkers.filter((coord) => !!coord).concat(...extents.map((extent) => extent.extent))
    );

    if (
      selectedExtent[0] !== Infinity &&
      selectedExtent[1] !== Infinity &&
      selectedExtent[2] !== -Infinity &&
      selectedExtent[3] !== -Infinity
    ) {
      extent = selectedExtent;
    }

    if (extent[0] !== Infinity && extent[1] !== Infinity && extent[2] !== -Infinity && extent[3] !== -Infinity) {
      this.map.getView().fit(extent, { padding: [20, 20, 70, 70], duration: 200 });
    }
  }

  private getAttributesForDrawing(classes: Class[], classId: string, layer: MapWidgetLayerOptions) {
    const classObj = classes.find((cl) => cl.id === classId) ?? ({ attributes: [] as Attribute[] } as Class);
    const locationAttribute = this.getLocationAttribute(classObj, layer);
    const intensityAttribute = this.getIntensityAttribute(
      classObj,
      layer as MapWidgetHeatMapLayerOptions | MapWidgetBubbleLayerOptions
    );
    return { locationAttribute, intensityAttribute };
  }

  private getIntensityAttribute(
    classObj: Class | undefined,
    layer: MapWidgetHeatMapLayerOptions | MapWidgetBubbleLayerOptions
  ) {
    return (
      (classObj || { attributes: [] }).attributes.find(
        (attr) => attr.technicalName === layer?.intensityAttribute ?? ''
      ) ?? (undefined as unknown as Attribute)
    );
  }

  private getLocationAttribute(classObj: Class, layer: MapWidgetLayerOptions): Attribute {
    type layers = MapWidgetHeatMapLayerOptions | MapWidgetMarkerLayerOptions | MapWidgetBubbleLayerOptions;
    const specificLayer = layer as layers;
    return (
      classObj.attributes.find((attr) => attr.technicalName === (specificLayer?.attribute ?? []) ?? '') ??
      (undefined as unknown as Attribute)
    );
  }

  changeStyle($event: any) {
    this.optionsCopy.style = $event;
    if (this.optionsCopy.style !== this.STYLE_FROM_URL) {
      delete this.optionsCopy.styleURL;
    }
  }

  changeStyleURL($event: Event) {
    // @ts-ignore
    this.optionsCopy.styleURL = $event.currentTarget?.value;
  }

  changeFit($event: boolean, layer: MapWidgetLayerOptions) {
    layer.fit = $event;
  }

  changeSlide($event: undefined | 'left' | 'right', layer: MapWidgetLayerOptions) {
    layer.slide = $event;
  }

  changeAttributions($event: boolean) {
    this.optionsCopy.attributions = $event;
    if (this.optionsCopy.attributions) {
      this.optionsCopy.layers?.forEach((layer) => (layer.attribution = ''));
    } else {
      this.optionsCopy.layers?.forEach((layer) => delete layer.attribution);
    }
  }

  addLayer() {
    if (!this.optionsCopy.layers) {
      this.optionsCopy.layers = [];
    }
    this.optionsCopy.layers.push({ attribute: '' } as MapWidgetLayerOptions);
  }

  changeLayerType($event: any, i: number) {
    if (!this.optionsCopy.layers) {
      this.optionsCopy.layers = this.optionsCopy.layers ?? [];
    }
    this.optionsCopy.layers[i].type = $event;
    if (this.optionsCopy.layers[i].type === 'wms') {
      const options = this.optionsCopy.layers[i] as MapWMSLayerLayerOptions;
      options.paramLayer = options.paramLayer ?? '';
      options.url = options.url ?? '';
    }
    if (this.optionsCopy.layers[i].type === 'wmts') {
      const options = this.optionsCopy.layers[i] as MapWMTSLayerLayerOptions;
      options.paramLayer = options.paramLayer ?? '';
      options.style = options.style ?? '';
      options.matrixSet = options.matrixSet ?? '';
      options.url = options.url ?? '';
    }
    if (['featurelayer', 'vectortile', 'rastertile'].includes(this.optionsCopy.layers[i].type)) {
      const options = this.optionsCopy.layers[i] as MapFeatureLayerOptions;
      options.url = options.url ?? '';
    }
  }

  changeTitle($event: any, layer: MapWidgetLayerOptions) {
    layer.title = $event.currentTarget?.value;
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: {
        ...this.manifest,
        options: { ...this.optionsCopy, layers: (this.optionsCopy.layers ?? []).filter((layer) => !!layer.type) }
      }
    });
  }

  changeLocationAttributes($event: any, layer: MapWidgetLayerOptions) {
    // @ts-ignore
    layer.attribute = $event;
  }

  layerHasIntensity(layer: MapWidgetLayerOptions): MapWidgetHeatMapLayerOptions | MapWidgetBubbleLayerOptions {
    return <MapWidgetHeatMapLayerOptions | MapWidgetBubbleLayerOptions>layer;
  }

  changeIntensityAttributes($event: any, layer: MapWidgetLayerOptions) {
    const layer_ = <MapWidgetHeatMapLayerOptions | MapWidgetBubbleLayerOptions>layer;
    layer_.intensityAttribute = $event;
  }

  changeClasses($event: string[], layer: MapWidgetLayerOptions) {
    const specificLayer = layer as
      | MapWidgetHeatMapLayerOptions
      | MapWidgetMarkerLayerOptions
      | MapWidgetBubbleLayerOptions;
    specificLayer.classes = $event;
  }

  deleteLayer(i: number, layer: MapWidgetLayerOptions) {
    this.optionsCopy?.layers?.splice(i, 1);
    if (layer.type === 'auto') {
      this.optionsCopy.ignoreAutoLayer = [...(this.optionsCopy.ignoreAutoLayer ?? []), layer.key + '-' + layer.subType];
    }
  }

  invertLayers(idx: number, idxWith: number) {
    if (!!this.optionsCopy && !!this.optionsCopy.layers) {
      const tmpOrder = this.optionsCopy.layers[idxWith].order;
      this.optionsCopy.layers[idxWith].order = this.optionsCopy.layers[idx].order;
      this.optionsCopy.layers[idx].order = tmpOrder;
      const tmpIndex = this.optionsCopy.layers[idxWith];
      this.optionsCopy.layers[idxWith] = this.optionsCopy.layers[idx];
      this.optionsCopy.layers[idx] = tmpIndex;
    }
  }

  changeUrl(
    $event: Event,
    layer:
      | MapWMSLayerLayerOptions
      | MapFeatureLayerOptions
      | MapVectorTileLayerOptions
      | MapRasterTileLayerOptions
      | MapWMTSLayerLayerOptions
      | MapGeoServerLayerOptions
  ) {
    // @ts-ignore
    layer.url = $event.currentTarget?.value;
  }

  changeAttribution($event: Event, layer: BaseWidgetMapLayerOptions) {
    // @ts-ignore
    layer.attribution = $event.currentTarget?.value;
  }

  changeParamLayer($event: Event, layer: MapWMSLayerLayerOptions | MapWMTSLayerLayerOptions) {
    // @ts-ignore
    layer.paramLayer = $event.currentTarget?.value;
  }

  changeParamTiled($event: boolean, layer: MapWMSLayerLayerOptions | MapGeoServerLayerOptions) {
    layer.paramTiled = $event;
    this.clearTooltip();
  }

  changeMatrixSet($event: Event, layer: MapWMTSLayerLayerOptions) {
    // @ts-ignore
    layer.matrixSet = $event.currentTarget?.value;
  }

  changeParamStyle($event: Event, layer: MapWMTSLayerLayerOptions) {
    // @ts-ignore
    layer.style = $event.currentTarget?.value;
  }

  export() {
    WidgetMapUtils.exportMapAsImage(this.map, 'map.png');
  }

  override toImage(): Promise<string> {
    return WidgetMapUtils.getMapAsPng(this.map);
  }

  changeClustered(layer: MapWidgetMarkerLayerOptions, $event: boolean) {
    layer.clustered = $event;
    if (layer.clustered) {
      layer.clusterDistance = 10;
    }
  }

  changeClusterDistance(layer: MapWidgetMarkerLayerOptions, $event: Event) {
    // @ts-ignore
    layer.clusterDistance = $event.currentTarget?.value;
  }

  changeOpacity(layer: MapWidgetLayerOptions, $event: string) {
    // @ts-ignore
    layer.opacity = parseInt($event, 10);
  }

  getWMSLayers(): Layer<any>[] {
    return !this.map
      ? []
      : this.map
          .getAllLayers()
          .filter((layer) => layer.getSource() instanceof TileWMS || layer.getSource() instanceof ImageWMS)
          // @ts-ignore
          .filter((layer) => layer.rendered === true);
  }

  isLayerRendered(layer: any) {
    return !!this.getWMSLayers().find((wmsLayer) => wmsLayer.get('title') === layer.title);
  }

  isLayerVisible(layer: any) {
    return !!this.getWMSLayers()
      .find((wmsLayer) => wmsLayer.get('title') === layer.title)
      ?.getVisible();
  }

  getFeatureFromServer(wmsLayers: Layer<any>[], pixel: Pixel) {
    for (const layer of wmsLayers) {
      const url = layer
        .getSource()
        .getFeatureInfoUrl(pixel, this.map.getView().getResolution(), this.map.getView().getProjection(), {
          INFO_FORMAT: 'application/json',
          FEATURE_COUNT: 10,
          ...layer.getProperties()['getFeatureInfoAdditionalParameters']
        });
      if (url && url.indexOf('I=-1') === -1 && url.indexOf('J=-1') === -1) {
        this.store.dispatch(
          DashboardActions.getWmsFeatures({
            url,
            oClass: layer.getProperties()['oClass'] ?? '',
            coordinates: pixel
          })
        );
      }
    }
  }

  changeWmsClass($event: any, layer: MapWMSLayerLayerOptions) {
    layer.oClass = $event;
  }

  toggleLegend(index: number) {
    this.legendTab = this.legendTab === index ? -1 : index;
  }

  toggleLegendWindow() {
    this.legendTabOpen = !this.legendTabOpen;
    this.layersTabOpen = false;
  }

  toggleLayersWindow() {
    this.layersTabOpen = !this.layersTabOpen;
    this.legendTabOpen = false;
  }

  tooltipMove(number: number) {
    if (this.tooltipCanMove(number)) {
      this.setStyleAsync(this.tooltipIndex, 'none');
      this.tooltipIndex = this.tooltipIndex + number;
      this.setStyleAsync(this.tooltipIndex, 'block');
    }
  }

  tooltipCanMove(number: number) {
    return this.tooltipIndex + number >= 0 && this.tooltipIndex + number < this.tooltipNumber;
  }

  private setStyleAsync(idx: number, value: string) {
    setTimeout(() => {
      const targetContainer = this.popupContent.get(idx);
      if (targetContainer) {
        // @ts-ignore
        targetContainer.rootNodes[0].style.display = value;
      }
    }, 100);
  }

  get mapLayers() {
    return (this.map ?? { getLayers: () => ({ getArray: () => [] }) })
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('title') !== 'background');
  }

  get rightSlideLayers() {
    return this.mapLayers.filter((layer) => layer.get('slide') === 'right');
  }

  get leftSlideLayers() {
    return this.mapLayers.filter((layer) => layer.get('slide') === 'left');
  }

  changeVisibility(layer: BaseLayer) {
    if (this.optionsCopy.singleLayer) {
      this.mapLayers.forEach((layer) => layer.setVisible(false));
      layer.setVisible(true);
    } else {
      layer.setVisible(!layer.getVisible());
    }
    this.map.updateSize();
  }

  changeSingleLayer($event: any) {
    this.optionsCopy.singleLayer = $event;
  }

  changeAutoLayer($event: any) {
    this.optionsCopy.automaticLayers = $event;
    if (!this.optionsCopy.automaticLayers) {
      delete this.optionsCopy.ignoreAutoLayer;
    }
  }

  get layerVisibleIdx() {
    return this.mapLayers.map((layer, idx) => (layer.getVisible() ? idx : 0)).reduce((a, b) => a + b);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(DashboardActions.resetWmsFeatures());

    // Trying to release objects
    this.clearLayers(this.map.getLayers().getArray());
    this.clearLayers(this.previousLayers);
    this.map.getRenderer()!.dispose();
    // @ts-ignore
    delete this.map;
    // @ts-ignore
    this.map = null;
    this.previousTooltipSub?.unsubscribe();
    this.previousTooltip?.destroy();
  }

  getStyle(_layer: MapWidgetLayerOptions) {
    const layer = _layer as MapWMSLayerLayerOptions | MapGeoServerLayerOptions;
    if (layer.additionalParameters?.STYLES) {
      return layer.additionalParameters?.STYLES;
    }
    /* Not manifest-defined style: use first in line because it's the default one sent by geoserver */
    const possibleStylesForUrl = this.possibleStyles[layer.url] ?? { layers: {} };
    let possiblesStylesForLayer = possibleStylesForUrl.layers![layer.paramLayer];
    if (!possiblesStylesForLayer) {
      possiblesStylesForLayer = possibleStylesForUrl.layers![(layer.paramLayer ?? ':').split(':')[1]] ?? { styles: [] };
    }
    return possiblesStylesForLayer.styles[0]?.id;
  }

  changeLayerStyle($event: any, _layer: MapWidgetLayerOptions) {
    const layer = _layer as MapWMSLayerLayerOptions | MapGeoServerLayerOptions;
    if (!layer.additionalParameters) {
      layer.additionalParameters = {};
    }
    layer.additionalParameters.STYLES = $event;
  }

  getAsWmsType(_layer: MapWidgetLayerOptions) {
    return _layer as MapWMSLayerLayerOptions | MapGeoServerLayerOptions;
  }

  layerStyleOptions(_layer: MapWidgetLayerOptions) {
    const layer = _layer as MapWMSLayerLayerOptions | MapGeoServerLayerOptions;
    const possibleStylesForUrl = this.possibleStyles[layer.url] ?? { layers: {} };
    let possiblesStylesForLayer = possibleStylesForUrl.layers![layer.paramLayer];
    if (!possiblesStylesForLayer) {
      possiblesStylesForLayer = possibleStylesForUrl.layers![(layer.paramLayer ?? ':').split(':')[1]] ?? { styles: [] };
    }
    return possiblesStylesForLayer.styles;
  }

  triggerLayerRender() {
    this.map.render();
  }

  changeSlideOption($event: any) {
    this.optionsCopy.slide = $event;
    if ($event === false) {
      this.optionsCopy.layers?.forEach((layer) => (layer.slide = 'all'));
    }
  }

  toggleMenu() {
    this.actionMenuOpen$.next(!this.actionMenuOpen$.getValue());
  }

  private getOlZoomElement() {
    this.olZoomElement$.next(document.querySelector('.ol-zoom'));
    if (!this.olZoomElement$.getValue()) {
      setTimeout(() => this.getOlZoomElement(), 50);
    } else {
      const zoomIn = document.querySelector('.ol-zoom-in');
      if (zoomIn) {
        zoomIn.setAttribute('data-tooltip', this.translateService.instant('@pry.widget.map.zoomIn'));
        zoomIn.setAttribute('data-tooltip-position', 'left');
        zoomIn.classList.add('a-tooltip', '--nopos');
        zoomIn.removeAttribute('title');
      }
      const zoomOut = document.querySelector('.ol-zoom-out');
      if (zoomOut) {
        zoomOut.setAttribute('data-tooltip', this.translateService.instant('@pry.widget.map.zoomOut'));
        zoomOut.setAttribute('data-tooltip-position', 'left');
        zoomOut.classList.add('a-tooltip', '--nopos');
        zoomOut.removeAttribute('title');
      }
    }
  }

  changeSelection(action: 'click' | 'lasso' | 'rectangle' | 'zoom' | 'move' | 'export' | 'upload') {
    this.interactionManager.selectionInteraction.changeSelection(action);
    this.toggleMenu();
  }

  private clearLayers(layers: BaseLayer[]) {
    layers.forEach((layer) => {
      this.map.removeLayer(layer);
      if (layer instanceof VectorLayer && (layer as VectorLayer<VectorSource>).getSource()) {
        (layer as VectorLayer<VectorSource>).getSource()!.clear();
        layer.setSource(undefined);
      }
      if (layer instanceof TileLayer && (layer as TileLayer<any>).getSource()) {
        (layer as TileLayer<any>).getSource().clear();
        layer.setSource(undefined);
      }
      layer.dispose();
    });
  }
}
