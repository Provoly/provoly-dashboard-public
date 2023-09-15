import { Overlay as cdkOverlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  Injector,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  BaseTooltipComponent,
  BaseWidgetMapLayerOptions,
  Class,
  ClassSelectors,
  ConfigActions,
  ConfigSelectors,
  DashboardActions,
  DashboardSelectors,
  Dataset,
  DataSourceSelectors,
  DataWidgetComponent,
  Field,
  FieldSelectors,
  GeoMetadata,
  ItemUtils,
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
  PryI18nService,
  PrySnackbarService,
  ResultsetUtils,
  SymbolService,
  TooltipFactoryService,
  TooltipMode,
  WIDGET_HEADER_HEIGHT,
  widgetMapConfig
} from '@provoly/dashboard';
import { CqlUtils } from '@provoly/dashboard/widgets/widget-map/utils/cql-utils.class';
import equal from 'fast-deep-equal/es6';
import { Feature, Map, Overlay, View } from 'ol';
import { applyBackground, applyStyle } from 'ol-mapbox-style';
import { boundingExtent, createEmpty } from 'ol/extent';
import { Circle, Geometry, Point } from 'ol/geom';
import { Tile } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Pixel } from 'ol/pixel';
import { fromLonLat, get as getProjection, transform } from 'ol/proj';

import { register } from 'ol/proj/proj4';
import { TileWMS } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';
import proj4 from 'proj4';
import {
  BehaviorSubject,
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
  startWith
} from 'rxjs';
import { InteractionManager } from '../interaction/interaction-manager.class';
import { MapFormatsReader } from '../reader/map-formats-reader.class';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_ZOOM_MAX,
  DEFAULT_ZOOM_MIN,
  DEFAULT_ZOOM_START,
  exportMapAsGeoJSON,
  exportMapAsImage,
  exportMapAsKML,
  getLinkFeature,
  getMapAsPng,
  populateIntensityAttribute,
  populateLocationAttribute
} from '../utils/widget-map.utils';
import { WidgetMapLayerService } from './widget-map-layer.service';

export const TOOLTIP_PADDING = 15;

@Component({
  selector: 'pry-widget-map',
  templateUrl: './widget-map.component.html'
})
export class WidgetMapComponent extends DataWidgetComponent implements AfterViewInit {
  mapUrl$: Observable<string>;
  @ViewChild('mapRef') mapRef!: ElementRef;
  @ViewChild('popup') popup!: ElementRef;
  @ViewChild('popupContent', { read: ViewContainerRef }) popupContent!: ViewContainerRef;
  @ViewChild('exportTypeTemplate', { read: TemplateRef }) exportTypeTemplate!: TemplateRef<any>;
  @ViewChild('address') address!: ElementRef;
  options$: Observable<MapWidgetOptions>;
  layerTypes = this.widgetMapLayerService.implementationList.sort((a, b) =>
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
  private overlayRef?: OverlayRef;
  styles$: Observable<{ identifier: string; label: string }[]>;
  WIDGET_HEADER_HEIGHT = WIDGET_HEADER_HEIGHT;
  i = 0;
  itemStyles$!: Observable<{ [id: string]: { classic: Style; bordered: Style } }>;
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
  layersTop$: Observable<number>;
  legendHeight$: Observable<number>;
  imageNotProvided: boolean[] = [];
  basicActions$: Observable<('click' | 'lasso' | 'rectangle' | 'zoom' | 'move' | 'export' | 'upload')[]>;
  zoomAndCenter$ = new BehaviorSubject<{ zoom?: { start: number; min: number; max: number }; center?: number[] }>({});
  fitOption$!: Observable<boolean>;
  mapStyleUrl$!: Observable<string | null>;
  interactionManager: InteractionManager = new InteractionManager();
  mapStyleLayer$!: Observable<VectorTileLayer[]>;
  tooltipIndex = 0;
  tooltipNumber = 0;
  STYLE_FROM_URL = '_url';
  NO_STYLE = 'none';

  constructor(
    store: Store<any>,
    private snackBar: PrySnackbarService,
    public translateService: PryI18nService,
    private tooltipFactoryService: TooltipFactoryService,
    private overlay: cdkOverlay,
    private viewContainerRef: ViewContainerRef,
    private symbolService: SymbolService,
    private injector: Injector,
    private widgetMapLayerService: WidgetMapLayerService,
    el: ElementRef
  ) {
    super(store, el);

    this.basicActions$ = this.actions$.pipe(
      map((actions) => actions.filter((action) => action !== 'export' && action !== 'upload'))
    );

    this.classes$ = this.store
      .select(ClassSelectors.classes)
      .pipe(map((classes) => classes.sort((a, b) => a.name.localeCompare(b.name))));
    this.fields$ = this.store.select(FieldSelectors.fields);
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
      this.usedDatasources$.pipe(startWith([])),
      this.store.select(ConfigSelectors.geoServerUrl).pipe(debounceTime(10), startWith(undefined))
    ]).pipe(
      map(([dataSources, geoServerUrl]) => {
        if (!geoServerUrl) return [];
        return dataSources
          .filter((ds) => ds.metadata?.find((m) => m.metadataDef.name === GeoMetadata.NAMESPACE) !== undefined)
          .map((ds) => {
            ds = ds as unknown as Dataset;
            const metadatas: { [key: string]: string } = {};
            ds.metadata?.forEach((m) => (metadatas[m.metadataDef.name] = m.value));
            return {
              type: 'geoserver',
              url: geoServerUrl + '/' + metadatas[GeoMetadata.NAMESPACE] + '/wms?SERVICE=WMS&VERSION=1.3.0',
              paramLayer: metadatas[GeoMetadata.KEY],
              paramTiled: true,
              opacity: parseInt(metadatas[GeoMetadata.OPACITY] ?? 100, 10),
              title: metadatas[GeoMetadata.NAMESPACE] + ':' + metadatas[GeoMetadata.KEY],
              oClass: ds.oClass,
              key: metadatas[GeoMetadata.NAMESPACE] + ':' + metadatas[GeoMetadata.KEY],
              datasourceId: ds.id
            };
          })
          .map((layer) => layer as MapGeoServerLayerOptions);
      })
    );

    this.options$ = combineLatest([
      this.manifest$,
      this.resultSet$,
      this.classes$,
      this.fields$,
      this.styles$,
      this.geoServerLayerDescriptions$
    ]).pipe(
      map(([manifest, resultSet, classes, fields, mapStyles, geoLayers]) => {
        // auto determine layers parameters to provide a working view
        const autoOptions = JSON.parse(JSON.stringify({ relations: true, ...manifest.options })) as MapWidgetOptions;
        if (!autoOptions.tooltipMode) {
          autoOptions.tooltipMode = TooltipMode.CLICK;
        }
        autoOptions.layers?.forEach((layer, i) => {
          populateLocationAttribute(layer, resultSet, classes, fields);
          populateIntensityAttribute(layer, resultSet, classes, fields);
          if (autoOptions.attributions) {
            layer.attribution = layer.attribution ?? '';
          }
          if (!layer.title) {
            this.setDefaultLayerTitle(layer, i);
          }
        });

        const actualLayerKeys = (autoOptions.layers ?? [])
          .map((layer) => (layer as MapGeoServerLayerOptions).key ?? null)
          .filter((key) => !!key);

        // Get all previous layers, without geoserver layers that are not requested anymore, then add new geoserver layers (potentially with a preconfig from manifest).
        autoOptions.layers = [
          ...(autoOptions.layers ?? []).map((layer) => {
            const geoLayer = geoLayers.find((layer) => layer.key === layer.key) ?? null;
            return layer.type === 'geoserver'
              ? geoLayer
                ? { ...geoLayer, ...layer }
                : (null as unknown as MapWidgetLayerOptions)
              : { ...layer };
          }),
          ...geoLayers.filter((layer) => !actualLayerKeys.includes(layer.key))
        ].filter((layer) => !!layer);

        if (
          !!mapStyles &&
          mapStyles.length > 0 &&
          (!autoOptions.style || !mapStyles.map((style) => style.identifier).includes(autoOptions.style))
        ) {
          const lightStyles = mapStyles.filter((style) => !(style.identifier ?? '-').includes('dark'));
          autoOptions.style = lightStyles.length > 0 ? lightStyles[0].identifier : mapStyles[0].identifier;
        }
        return autoOptions;
      })
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
            new Promise<{ [id: string]: { classic: Style; bordered: Style } }>((resolve, reject) => {
              const total = Object.values(rs.items).reduce((p, c) => c.length + p, 0);
              if (total === 0) resolve({});
              const result = {} as { [id: string]: { classic: Style; bordered: Style } };
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

    this.layersTop$ = this.displayHeader$.pipe(map((display) => 140 - (display ? 0 : WIDGET_HEADER_HEIGHT)));
    this.legendTop$ = this.displayHeader$.pipe(map((display) => 180 - (display ? 0 : WIDGET_HEADER_HEIGHT)));

    this.legendHeight$ = combineLatest([this.widgetSize$.pipe(debounceTime(100)), this.legendTop$]).pipe(
      map(([size, top]) => {
        return (size.height ?? 100) - WIDGET_HEADER_HEIGHT - top - 56; // 56px is the tooltip height + margin
      }),
      delay(10)
    );
  }

  initInteractionManager() {
    return this.interactionManager.init(this);
  }

  ngAfterViewInit(): void {
    this.map = new Map({ target: this.mapRef.nativeElement });
    this.interactionManager = this.initInteractionManager();
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
        const layer = new VectorTileLayer({
          declutter: true,
          properties: { title: 'background' }
        });
        applyStyle(layer, styleUrl).catch((err) => console.warn('Style application problem', err));
        applyBackground(layer, styleUrl).catch((err) => console.warn('Background application problem', err));
        return [layer];
      })
    );

    this.options$
      .pipe(
        map((options) => ({
          center: fromLonLat(options.center ?? DEFAULT_MAP_CENTER),
          maxZoom: options.zoom?.max ?? DEFAULT_ZOOM_MAX,
          minZoom: options.zoom?.min ?? DEFAULT_ZOOM_MIN,
          zoom: options.zoom?.start ?? DEFAULT_ZOOM_START
        })),
        distinctUntilChanged()
      )
      .subscribe((view) => this.map.setView(new View(view)));

    this.fitOption$ = this.options$.pipe(
      map((options) => !!options.fit),
      distinctUntilChanged()
    );

    this.fitOption$.subscribe((fit) => this.fitMapForObjects(fit));

    this.layers$ = combineLatest([
      this.resultSet$,
      this.options$,
      this.classes$,
      this.additionalLayers$,
      this.itemStyles$,
      this.store.select(DashboardSelectors.datasourceFilters)
    ]).pipe(
      filter(
        ([resultSet, options, classes, additionalLayers, itemStyles, filters]) => !!resultSet && !!options && !!classes
      ),
      map(([resultSet, options, classes, additionalLayers, itemStyles, filters]) => {
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
          .map((layer: MapWidgetLayerOptions, idx) => {
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
              if (layer.type === 'relation') {
                hasRelationLayer = resultLayer as unknown as VectorLayer<VectorSource>;
              }
              resultLayer.set('title', layer.title);

              if (layer.type === 'geoserver') {
                const cql_filter = CqlUtils.getCQLParamsFor(layer.datasourceId, filters, classes);

                if (cql_filter) {
                  // Adding CQL query to geoserver layers
                  (resultLayer as Tile<TileWMS>).getSource()!.updateParams({ cql_filter });
                }
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
              hasRelationLayer.getSource()?.addFeature(getLinkFeature(relation, source, dest));
            }
          });
        }
        layers.push(...additionalLayers);
        layers.forEach((layer, index, arr) => layer.set('zIndex', arr.length - index));

        if (options.singleLayer) {
          layers.forEach((layer, idx) => {
            layer.setVisible(idx === 0);
          });
        }

        return layers;
      })
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

    this.subscriptions.add(
      combineLatest([this.mapStyleLayer$, this.layers$, this.fitOption$, this.selectedIds$]).subscribe(
        ([mapStyleLayer, layers, fit, selectedIds]) => {
          const toApplyLayers = [...layers, ...mapStyleLayer];
          this.map.setLayers(toApplyLayers);
          this.map
            .getAllLayers()
            .filter((layer) => !(layer instanceof Tile))
            .forEach((layer) => {
              const getFeatures = (layer.getSource() as VectorSource)?.getFeatures;
              if (typeof getFeatures === 'function') {
                (layer.getSource() as VectorSource)?.getFeatures().forEach((feature: any) => {
                  const type = feature.get('type');
                  if (['bubble', 'marker', 'point', 'line', 'polygon', 'multi-line', 'multi-polygon'].includes(type)) {
                    feature.setStyle(
                      feature.get(selectedIds.includes(feature.get('id')) ? 'selectedStyle' : 'classicStyle')
                    );
                  }
                });
              }
            });

          setTimeout(() => {
            this.fitMapForObjects(fit, selectedIds);
            this.map.updateSize();
          }, 200);
        }
      )
    );
    this.subscriptions.add(
      combineLatest([this.wmsFeatures$, this.classicFeatures$, this.widgetSize$, this.displayHeader$]).subscribe(
        ([wmsFeatures, classicFeatures, size, header]) => {
          if (this.map) {
            this.tooltipIndex = 0;
            const popupOverlay = new Overlay({
              element: this.popup.nativeElement,
              offset: [9, 9]
            });
            this.map.addOverlay(popupOverlay);
            this.popupContent.clear();
            const componentPromises = [] as Promise<ComponentRef<BaseTooltipComponent> | null>[];
            wmsFeatures.forEach((value) => {
              componentPromises.push(this.generateTooltip(value));
            });
            classicFeatures.forEach((value: any) => {
              componentPromises.push(this.generateTooltip(value));
            });

            Promise.all(componentPromises).then((promises) => {
              const realComponents = promises.filter((component) => !!component);
              this.tooltipNumber = realComponents.length;
              if (realComponents.length <= 0) {
                this.popup.nativeElement.hidden = true;
                popupOverlay.setPosition([-9999999999, -9999999999]);
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
                popupOverlay.setPosition(this.map.getCoordinateFromPixel(pixel ?? [0, 0]));
              }
            });
          }
        }
      )
    );
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
      component$.subscribe((component) => {
        if (component) {
          component.instance.data.item = value.values;
          component.instance.popup = this.popup;
          resolve(component);
        }
        resolve(null);
      });
    });
  }

  setDefaultLayerTitle(layer: MapWidgetLayerOptions, idx: number) {
    layer.title =
      idx + 1 + ' - ' + this.translateService.instant(`@pry.widget.map.layerType.${layer.type}`, { ...layer });
  }

  fitMapForObjects(fit: boolean, selectedIds?: string[]) {
    if (fit) {
      let extent = createEmpty();
      const listOfMarkers = [] as any[];

      this.map
        .getAllLayers()
        .filter(
          (layer) => !!layer.getSource && !!layer.getSource() && !!(layer.getSource() as VectorSource).getFeatures
        )
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

      const selectedExtent = boundingExtent(listOfMarkers.filter((coord) => !!coord));
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
      (classObj || { attributes: [] }).attributes.find((attr) => attr.name === layer?.intensityAttribute ?? '') ??
      (undefined as unknown as Attribute)
    );
  }

  private getLocationAttribute(classObj: Class, layer: MapWidgetLayerOptions): Attribute {
    type layers = MapWidgetHeatMapLayerOptions | MapWidgetMarkerLayerOptions | MapWidgetBubbleLayerOptions;
    const specificLayer = layer as layers;
    return (
      classObj.attributes.find((attr) => attr.name === (specificLayer?.attribute ?? []) ?? '') ??
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

  changeFit($event: boolean) {
    this.optionsCopy.fit = $event;
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

  deleteLayer(i: number) {
    this.optionsCopy?.layers?.splice(i, 1);
  }

  invertLayers(idx: number, idxWith: number) {
    if (!!this.optionsCopy && !!this.optionsCopy.layers) {
      const tmp = this.optionsCopy.layers[idxWith];
      this.optionsCopy.layers[idxWith] = this.optionsCopy.layers[idx];
      this.optionsCopy.layers[idx] = tmp;
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

  changeParamTiled($event: boolean, layer: MapWMSLayerLayerOptions) {
    layer.paramTiled = $event;
  }

  changeMatrixSet($event: Event, layer: MapWMTSLayerLayerOptions) {
    // @ts-ignore
    layer.matrixSet = $event.currentTarget?.value;
  }

  changeParamStyle($event: Event, layer: MapWMTSLayerLayerOptions) {
    // @ts-ignore
    layer.style = $event.currentTarget?.value;
  }

  export(type: string) {
    switch (type) {
      case 'png':
        exportMapAsImage(this.map, 'map.png');
        break;
      case 'kml':
        exportMapAsKML(this.map, 'map.kml');
        break;
      case 'geoJSON':
        exportMapAsGeoJSON(this.map, 'map.geojson');
        break;
      default:
        console.error('Unknown format');
    }
    this.hideExportType();
  }

  override toImage(): Promise<string> {
    return getMapAsPng(this.map);
  }

  import(event: Event | DragEvent) {
    const reader = new MapFormatsReader(this.map);
    const input = event instanceof DragEvent ? event.dataTransfer : (event.target as HTMLInputElement);
    if (!!input && !!input.files && input.files.length > 0) {
      const filename = input.files[0].name;
      this.snackBar.open({
        type: 'info',
        message: this.translateService.instant('@pry.widget.map.importStart', { filename })
      });
      reader
        .decodeFile(input.files[0])
        .then((layer) => {
          this.additionalLayers$.next([...this.additionalLayers$.getValue(), layer]);
          this.snackBar.open({
            type: 'success',
            message: this.translateService.instant('@pry.widget.map.importOk', { filename })
          });
        })
        .catch((err) =>
          this.snackBar.open({ type: 'error', message: this.translateService.instant(err.msg, err.val) })
        );
    }
    if (!!input && !(input instanceof DataTransfer)) {
      input.value = null as unknown as string;
    }
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

  hideAddress() {
    this.address.nativeElement.style.display = 'none';
  }

  changeOpacity(layer: MapWidgetLayerOptions, $event: string) {
    // @ts-ignore
    layer.opacity = parseInt($event, 10);
  }

  displayExportType($event: MouseEvent) {
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['m-context-menu-wrapper'],
        backdropClass: 'backdrop'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRef.backdropClick().subscribe((_) => this.hideExportType());
    this.overlayRef.attach(new TemplatePortal(this.exportTypeTemplate, this.viewContainerRef));

    const contextMenu = document.querySelector('div.m-context-menu-wrapper') as HTMLDivElement;
    if (!!contextMenu) {
      contextMenu.style.left = $event.clientX - 10 + 'px';
      contextMenu.style.top = $event.clientY - 10 - contextMenu.clientHeight + 'px';
    }
  }

  hideExportType() {
    this.overlayRef?.dispose();
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
  }

  getWMSLayers() {
    return !this.map
      ? []
      : this.map
          .getAllLayers()
          .filter((layer) => layer.getSource() instanceof TileWMS)
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

  getFeatureFromServer(wmsLayers: any[], pixel: Pixel) {
    proj4.defs(
      'EPSG:2154',
      '+proj=lcc +lat_0=46.5 +lon_0=3 +lat_1=49 +lat_2=44 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
    );
    register(proj4);
    const projGeo = getProjection('EPSG:3857');
    const projLambert = getProjection('EPSG:2154');

    if (projLambert && projGeo) {
      for (const layer of wmsLayers) {
        const url = layer
          .getSource()
          .getFeatureInfoUrl(transform(pixel, projGeo, projLambert), this.map.getView().getResolution(), 'EPSG:2154', {
            INFO_FORMAT: 'application/json',
            FEATURE_COUNT: 10
          });
        if (url) {
          this.store.dispatch(
            DashboardActions.getWmsFeatures({
              url,
              oClass: layer.getProperties().oClass ?? '',
              coordinates: pixel
            })
          );
        }
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
    return this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('title') !== 'background');
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

  get layerVisibleIdx() {
    return this.mapLayers.map((layer, idx) => (layer.getVisible() ? idx : 0)).reduce((a, b) => a + b);
  }
}
