import {
  Attribute,
  Class,
  Field,
  FieldType,
  Item,
  ItemUtils,
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

export const populateLocationAttribute = (
  layer: MapWidgetLayerOptions,
  resultSet: ResultSet,
  classesNotFiltered: Class[],
  fields: Field[]
) => {
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

      const geometry = geometryForLayer(layer);

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
};

export const populateIntensityAttribute = (
  layer: MapWidgetLayerOptions,
  resultSet: ResultSet,
  classesNotFiltered: Class[],
  fields: Field[]
) => {
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
};

export const getFeatureFromItem = (
  item: Item,
  type: string,
  locationAttribute: Attribute,
  iconStyle?: Style,
  selectedIconStyle?: Style
) => {
  return new Feature({
    ...item,
    type,
    geometry: ItemUtils.readGeometry(item, 'point', locationAttribute),
    classicStyle: iconStyle ?? null,
    selectedStyle: selectedIconStyle ?? null
  });
};

export const getCircleFeatureFromItem = (
  item: Item,
  locationAttribute: Attribute,
  radius: number,
  iconStyle: Style,
  selectedIconStyle: Style
) => {
  return new Feature({
    ...item,
    geometry: new Circle((ItemUtils.readGeometry(item, 'point', locationAttribute) as Point).getCoordinates(), radius),
    classicStyle: iconStyle,
    selectedStyle: selectedIconStyle,
    type: 'bubble'
  });
};

export const getLinkFeature = (
  relation: Relation,
  featureSource: Feature<Point>,
  featureDestination: Feature<Point>
) => {
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
};

export const getMapAsPng = (map: Map) => {
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
};

export const exportMapAsImage = (map: Map, filename: string) => {
  getMapAsPng(map).then((data) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = data;
    link.click();
  });
};

export const geometryForLayer = (layer: MapWidgetLayerOptions): string => {
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
      return geometryForLayer({
        type: WidgetMapLayerService.translateFieldTypeToLayerType(layer.subType)
      } as MapWidgetLayerOptions);
    default:
      return FieldType.POINT;
  }
};

export const assignLayersOrder = (_layers: MapWidgetLayerOptions[]) => {
  const layers = JSON.parse(JSON.stringify(_layers)) as MapWidgetLayerOptions[];

  layers.sort((l1, l2) => (l2.background ? 0 : 1) - (l1.background ? 0 : 1));

  // Assign sure things
  layers.forEach((layer, index) => {
    if (layer.background) {
      layer.order = BACKGROUND_ORDER;
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
};

export const DEFAULT_HEATMAP_RADIUS = 25;
export const DEFAULT_RADIUS_INTENSITY_FACTOR = 10000;
export const DEFAULT_ZOOM_MIN = 3;
export const DEFAULT_ZOOM_START = 10;
export const DEFAULT_ZOOM_MAX = 18;
export const DEFAULT_MAP_CENTER = [2.2827217347381525, 48.864706031557716];

export const BACKGROUND_ORDER = 9999;
