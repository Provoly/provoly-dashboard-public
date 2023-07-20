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
// @ts-ignore
import tokml from 'geojson-to-kml';
import { Feature, Map } from 'ol';
import { GeoJSON } from 'ol/format';
import { Circle, LineString, Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';

export type LatLonCandidate = {
  min: number;
  max: number;
  name: string;
  type: string;
};

export const populateLocationAttribute = (
  layer: MapWidgetLayerOptions,
  resultSet: ResultSet,
  classesNotFiltered: Class[],
  fields: Field[]
) => {
  if (
    ['heatmap', 'marker', 'bubble', 'point', 'line', 'polygon', 'multi-line', 'multi-polygon'].includes(layer.type) &&
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

      let candidates = [] as { attr: Attribute; field: Field | undefined }[];
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
          .reduce((p, c) => [...p, ...c], [])
          .map((attr) => fields.filter((field) => field?.type === geometry).map((field) => ({ attr, field })))
          .reduce((p, c) => [...p, ...c], []);
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
      featureSource.getGeometry()?.getCoordinates() ?? [0, 0],
      featureDestination.getGeometry()?.getCoordinates() ?? [0, 0]
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

const exportMapAsGeoJSONString = (map: Map): Promise<string> => {
  return new Promise((resolve, reject) => {
    const format = new GeoJSON();
    const features = [] as Feature<any>[];
    const promises = map
      .getAllLayers()
      .filter((layer) => !!layer.getSource && !!layer.getSource() && !!(layer.getSource() as VectorSource).getFeatures)
      .map((layer) => (layer.getSource() as VectorSource).getFeatures())
      .filter((promise) => !!promise);
    Promise.all(promises)
      .then((featuresOfLayer) => {
        featuresOfLayer.forEach((feature) => {
          features.push(...feature);
        });
        resolve(format.writeFeatures(features) as string);
      })
      .catch((err) => reject(err));
  });
};

export const exportMapAsGeoJSON = (map: Map, filename: string) => {
  exportMapAsGeoJSONString(map).then((output) => {
    const link = document.createElement('a');
    link.download = filename;
    const blob = new Blob([output], {
      type: 'application /geo+json'
    });
    link.href = URL.createObjectURL(blob);
    link.click();
  });
};

export const exportMapAsKML = (map: Map, filename: string) => {
  exportMapAsGeoJSONString(map).then((output) => {
    const geoJSON = JSON.parse(output);
    const kml = tokml(geoJSON);
    const link = document.createElement('a');
    link.download = filename;
    const blob = new Blob([kml], {
      type: 'application/vnd.google-earth.kml+xml'
    });
    link.href = URL.createObjectURL(blob);
    link.click();
  });
};

export const geometryForLayer = (layer: MapWidgetLayerOptions) => {
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
    default:
      return FieldType.POINT;
  }
};

export const DEFAULT_HEATMAP_RADIUS = 25;
export const DEFAULT_RADIUS_INTENSITY_FACTOR = 10000;
export const DEFAULT_ZOOM_MIN = 3;
export const DEFAULT_ZOOM_START = 10;
export const DEFAULT_ZOOM_MAX = 18;
export const DEFAULT_MAP_CENTER = [2.2827217347381525, 48.864706031557716];
export const EMPTY_MAP_STYLE = { layers: [] };
