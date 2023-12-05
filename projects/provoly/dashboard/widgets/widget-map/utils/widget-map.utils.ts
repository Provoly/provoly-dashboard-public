import {
  AggregationResult,
  Attribute,
  AttributeSimpleValue,
  Class,
  DEFAULT_PROJECTION,
  Field,
  FieldType,
  GetCapabilitiesResponse,
  Item,
  ItemUtils,
  MapGeoServerLayerOptions,
  MapWidgetBubbleLayerOptions,
  MapWidgetHeatMapLayerOptions,
  MapWidgetLayerOptions,
  MapWidgetMarkerLayerOptions,
  Relation,
  ResultSet
} from '@provoly/dashboard';
import { Feature, Map } from 'ol';
import { Circle, LineString, Point } from 'ol/geom';
import { Style } from 'ol/style';
import { WidgetMapLayerService } from '../component/widget-map-layer.service';
import { get as getProjection, ProjectionLike, transform } from 'ol/proj';
import Geometry from 'ol/geom/Geometry';
import { GeoJSON } from 'ol/format';
import { XMLUtils } from './xml-utils.class';

export class WidgetMapUtils {
  static populateLocationAttribute(
    layer: MapWidgetLayerOptions,
    resultSet: ResultSet,
    classesNotFiltered: Class[],
    fields: Field[]
  ) {
    if (
      ['heatmap', 'marker', 'bubble', 'point', 'line', 'polygon', 'multi-line', 'multi-polygon', 'auto'].includes(
        layer.type
      ) &&
      !!resultSet &&
      !!classesNotFiltered &&
      classesNotFiltered.length > 0
    ) {
      const specificLayer = layer as
        | MapWidgetHeatMapLayerOptions
        | MapWidgetMarkerLayerOptions
        | MapWidgetBubbleLayerOptions;

      const classes = classesNotFiltered.filter(
        (cl) => specificLayer.classes?.includes(cl.id) || !specificLayer.classes || specificLayer.classes.length === 0
      );

      if (!specificLayer.attribute) {
        // No location attribute available, then try to guess one that will be ok

        const geometry = WidgetMapUtils.geometryForLayer(layer);

        let candidates = [] as {
          attr: Attribute;
          field: Field | undefined;
        }[];
        if (Object.keys(resultSet.items).length > 0) {
          // Based on items that we have to display

          candidates = Object.keys(resultSet.items)
            .map((key) => ({ items: resultSet.items[key], oClass: classes.find((cl) => cl.id === key) }))
            .map(({ items, oClass }) =>
              (oClass ?? { attributes: [] }).attributes
                .map((attr) => ({ attr, field: fields.find((f) => f.id === attr.field) }))
                .filter((attr) => attr.field?.type === geometry)
            )
            .reduce((p, c) => [...p, ...c], []);
        } else {
          // We don't have any items to display, so allow all corresponding geometry fields
          candidates = classesNotFiltered
            .map((clazz) => clazz.attributes)
            .flat()
            .map((attr) => ({ attr, field: fields.find((field) => field.id === attr.field) }))
            .filter(({ attr, field }) => field?.type === geometry);
        }

        if (candidates.length > 0) {
          specificLayer.attribute = candidates[0].attr.name;
        }
      }
    }
  }

  static populateIntensityAttribute(
    layer: MapWidgetLayerOptions,
    resultSet: ResultSet,
    classesNotFiltered: Class[],
    fields: Field[]
  ) {
    if (
      ['heatmap', 'bubble'].includes(layer.type) &&
      !!resultSet &&
      !!classesNotFiltered &&
      classesNotFiltered.length > 0
    ) {
      const specificLayer = layer as MapWidgetHeatMapLayerOptions | MapWidgetBubbleLayerOptions;

      const classes = classesNotFiltered.filter(
        (cl) =>
          (specificLayer.classes?.includes(cl.id) || !specificLayer.classes || specificLayer.classes.length === 0) &&
          cl.attributes.find((attr) => attr.name === (specificLayer?.attribute ?? []))
      );

      if (!specificLayer.intensityAttribute) {
        // No intensity attribute available, then take the maximum intensity matching attribute
        const candidatesDry = Object.keys(resultSet.items)
          .map((key) => ({ items: resultSet.items[key], oClass: classes.find((cl) => cl.id === key) }))
          .map(({ items, oClass }) => {
            return (oClass ?? { attributes: [] }).attributes
              .map((attr) => ({ attr, field: fields.find((f) => f.id === attr.field) }))
              .filter((attr) => attr.field?.type === FieldType.DECIMAL || attr.field?.type === FieldType.INTEGER)
              .map((attr) => {
                const attrValues = ItemUtils.pertinentValue(items, attr.attr);
                return {
                  min: Math.min(...attrValues),
                  max: Math.max(...attrValues),
                  name: attr.attr.name
                };
              });
          })
          .reduce((p, c) => [...p, ...c], [])
          .sort((a, b) => b.max - a.max);

        if (candidatesDry.length > 0) {
          specificLayer.intensityAttribute = candidatesDry[0].name;
          specificLayer.intensityAsc = true;
        }
      }
    }
  }

  static getFeatureFromItem(
    projection: ProjectionLike,
    item: Item,
    type: string,
    locationAttribute: Attribute,
    iconStyle?: Style,
    selectedIconStyle?: Style
  ) {
    return new Feature({
      ...item,
      type,
      geometry: WidgetMapUtils.readGeometry(projection, item, 'point', locationAttribute) ?? undefined,
      classicStyle: iconStyle ?? null,
      selectedStyle: selectedIconStyle ?? null
    });
  }

  static getCircleFeatureFromItem(
    projection: ProjectionLike,
    item: Item,
    locationAttribute: Attribute,
    radius: number,
    iconStyle: Style,
    selectedIconStyle: Style
  ) {
    return new Feature({
      ...item,
      geometry: new Circle(
        (WidgetMapUtils.readGeometry(projection, item, 'point', locationAttribute) as Point).getCoordinates(),
        radius
      ),
      classicStyle: iconStyle,
      selectedStyle: selectedIconStyle,
      type: 'bubble'
    });
  }

  static getLinkFeature(relation: Relation, featureSource: Feature<Point>, featureDestination: Feature<Point>) {
    return new Feature({
      ...relation,
      geometry: new LineString([
        // @ts-ignore
        featureSource.getGeometry()?.getCoordinates() ?? featureSource.getGeometry()?.getCenter() ?? [0, 0],
        // @ts-ignore
        featureDestination.getGeometry()?.getCoordinates() ?? featureDestination.getGeometry()?.getCenter() ?? [0, 0]
      ]),
      source: featureSource,
      destination: featureDestination,
      type: 'link'
    });
  }

  static getMapAsPng(map: Map) {
    return new Promise<string>((resolve, reject) => {
      map.once('rendercomplete', function () {
        const mapCanvas = document.createElement('canvas');
        const size = map.getSize() || [100, 100];
        mapCanvas.width = size[0];
        mapCanvas.height = size[1];
        const mapContext = mapCanvas.getContext('2d') || (null as unknown as CanvasRenderingContext2D);
        Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas, canvas.ol-layer'), (canvas) => {
          if (canvas.width > 0) {
            const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }

            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              // Get the transform parameters from the style's transform matrix
              matrix = transform
                .match(/^matrix\(([^(]*)\)$/)[1]
                .split(',')
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0
              ];
            }
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
            mapContext.drawImage(canvas, 0, 0);
          }
        });
        mapContext.globalAlpha = 1;
        resolve(mapCanvas.toDataURL('image/png'));
      });
      map.renderSync();
    });
  }

  static exportMapAsImage(map: Map, filename: string) {
    WidgetMapUtils.getMapAsPng(map).then((data) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = data;
      link.click();
    });
  }

  static geometryForLayer(layer: MapWidgetLayerOptions): string {
    switch (layer.type) {
      case 'marker':
      case 'heatmap':
      case 'bubble':
      case 'point':
        return FieldType.POINT;
      case 'line':
        return FieldType.LINE;
      case 'polygon':
        return FieldType.POLYGON;
      case 'multi-line':
        return FieldType.MULTILINE;
      case 'multi-polygon':
        return FieldType.MULTIPOLYGON;
      case 'auto':
        return WidgetMapUtils.geometryForLayer({
          type: WidgetMapLayerService.translateFieldTypeToLayerType(layer.subType)
        } as MapWidgetLayerOptions);
      default:
        return FieldType.POINT;
    }
  }

  static assignLayersOrder(_layers: MapWidgetLayerOptions[]) {
    const layers = JSON.parse(JSON.stringify(_layers)) as MapWidgetLayerOptions[];

    layers.sort((l1, l2) => (l2.background ? 0 : 1) - (l1.background ? 0 : 1));

    // Assign sure things
    layers.forEach((layer, index) => {
      if (layer.background) {
        layer.order = WidgetMapUtils.BACKGROUND_ORDER;
      }
      if (index === 0 && !layer.order) {
        layer.order = 0;
      }
    });

    layers.forEach((layer, index) => {
      if (layer.order === undefined) {
        let [distanceToFirstPreviousOrder, distanceToFirstNextOrder] = [
          layers
            .slice(0, index)
            .reverse()
            .findIndex((element) => element.order !== undefined) + 1,
          layers.slice(index + 1).findIndex((element) => element.order !== undefined)
        ];

        let [previousOrderIndex, nextOrderIndex] = [
          distanceToFirstPreviousOrder > -1 ? index - distanceToFirstPreviousOrder : 0,
          distanceToFirstNextOrder + index + 1
        ];
        let [previousOrder, nextOrder] = [
          distanceToFirstPreviousOrder > -1 ? layers[previousOrderIndex].order! : 0,
          distanceToFirstNextOrder > -1 ? layers[nextOrderIndex].order! : -1
        ];

        if (nextOrder > 0 && nextOrder < previousOrder) {
          const newOrder = previousOrder + (nextOrderIndex - previousOrderIndex);
          console.warn(
            `the order property of layer no ${index + 2} was preset but doesn't follow the order of the other layers`
          );
          nextOrder = newOrder;
        }

        if (nextOrder > 0) {
          let relativeIndex = index - previousOrderIndex;
          layer.order =
            previousOrder + ((nextOrder - previousOrder) / (nextOrderIndex - previousOrderIndex)) * relativeIndex;
        } else {
          layer.order = previousOrder + distanceToFirstPreviousOrder;
        }
      }
    });

    return layers.sort((l1, l2) => (l1.order ?? 1) - (l2.order! ?? 1));
  }

  static readGeometry<T extends 'point' | 'line' | 'multi-line' | 'polygon' | 'multi-polygon'>(
    projection: ProjectionLike,
    item: Item,
    type: T,
    attribute: Attribute | undefined
  ) {
    if (!attribute) {
      // @ts-ignore
      return null;
    }

    let value = item.attributes[attribute.name];
    if (value.type === 'MULTI') {
      value = value.values[0];
    }
    let geometry;
    try {
      geometry = new GeoJSON().readGeometry(value.value as any, {
        featureProjection: projection
      }) as Geometry;
    } catch (e) {
      console.warn('error reading Geometry', value.value, e);
    }

    return geometry;
  }

  static extractGeometries(value: AttributeSimpleValue, points: any[], type: 'point' | 'line' | 'polygon') {
    const valueSimple = value.value;
    if (typeof valueSimple !== 'string' && typeof valueSimple !== 'number') {
      if (type === 'point' && valueSimple.type === FieldType.POINT) {
        points.push(valueSimple.coordinates);
      }
      if (type === 'point' && valueSimple.type === FieldType.MULTIPOINT) {
        points.push(...valueSimple.coordinates);
      }
      if (type === 'line' && valueSimple.type === FieldType.LINE) {
        points.push(valueSimple.coordinates);
      }
      if (type === 'line' && valueSimple.type === FieldType.MULTILINE) {
        points.push(...valueSimple.coordinates);
      }
      if (type === 'polygon' && valueSimple.type === FieldType.POLYGON) {
        points.push(valueSimple.coordinates);
      }
      if (type === 'polygon' && valueSimple.type === FieldType.MULTIPOLYGON) {
        points.push(...valueSimple.coordinates);
      }
    }
  }

  static projectExtentAggregationResponse(
    field: Field,
    extentResponse: AggregationResult,
    layer: MapGeoServerLayerOptions,
    wmsCapabilities: { [p: string]: GetCapabilitiesResponse | null } | undefined,
    map: Map
  ) {
    const projBox = getProjection(field!.crs ?? DEFAULT_PROJECTION);
    const response = extentResponse.values as {
      value: {
        top_left: {
          lon: string;
          lat: string;
        };
        bottom_right: {
          lon: string;
          lat: string;
        };
      };
    }[];
    if (
      projBox &&
      response.length > 0 &&
      response[0].value &&
      response[0].value.top_left &&
      response[0].value.top_left.lat !== undefined &&
      response[0].value.top_left.lon !== undefined &&
      response[0].value.bottom_right &&
      response[0].value.bottom_right.lat !== undefined &&
      response[0].value.bottom_right.lon !== undefined
    ) {
      return {
        datasource: layer.datasourceId,
        extent: [
          transform(
            [
              parseFloat(
                (
                  extentResponse.values[0] as {
                    value: {
                      top_left: {
                        lon: string;
                      };
                    };
                  }
                ).value.top_left.lon
              ),
              parseFloat(
                (
                  extentResponse.values[0] as {
                    value: {
                      top_left: {
                        lat: string;
                      };
                    };
                  }
                ).value.top_left.lat
              )
            ],
            projBox,
            map.getView().getProjection()
          ),
          transform(
            [
              parseFloat(
                (
                  extentResponse.values[0] as {
                    value: {
                      bottom_right: {
                        lon: string;
                      };
                    };
                  }
                ).value.bottom_right.lon
              ),
              parseFloat(
                (
                  extentResponse.values[0] as {
                    value: {
                      bottom_right: {
                        lat: string;
                      };
                    };
                  }
                ).value.bottom_right.lat
              )
            ],
            projBox,
            map.getView().getProjection()
          )
        ]
      };
    }

    return {
      datasource: layer.datasourceId,
      extent: XMLUtils.getLayerExtent(layer.paramLayer, map, wmsCapabilities![layer.url]?.doc) ?? []
    };
  }

  static DEFAULT_HEATMAP_RADIUS = 25;
  static DEFAULT_RADIUS_INTENSITY_FACTOR = 10000;
  static DEFAULT_ZOOM_MIN = 3;
  static DEFAULT_ZOOM_START = 10;
  static DEFAULT_ZOOM_MAX = 18;
  static DEFAULT_MAP_CENTER = [2.2827217347381525, 48.864706031557716];

  static BACKGROUND_ORDER = 9999;
}
