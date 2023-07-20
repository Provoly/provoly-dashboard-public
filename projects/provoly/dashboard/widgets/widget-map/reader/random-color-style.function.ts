import { Feature } from 'ol';
import {
  Circle,
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon
} from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import RenderFeature from 'ol/render/Feature';

export const randomColor = () => [
  Math.round(Math.random() * 255),
  Math.round(Math.random() * 255),
  Math.round(Math.random() * 255)
];

export const styleFunction = (color: number[]) => (feature: Feature<Geometry> | RenderFeature) => {
  const stroke = new Stroke({
    color: `rgb(${color.join(',')})`,
    width: 1
  });
  const fill = new Fill({ color: `rgba(${color.join(',')}, 0.1)` });
  const image = new CircleStyle({ radius: 5, fill, stroke });
  switch (feature.getGeometry()?.getType() as any) {
    case Point:
    case MultiPoint:
      return new Style({ image });
    case LineString:
    case MultiLineString:
      return new Style({ stroke });
    case MultiPolygon:
    case Polygon:
    case Circle:
      return new Style({ stroke, fill });
    case GeometryCollection:
    default:
      return new Style({ stroke, fill, image });
  }
};
