import { Injectable } from '@angular/core';
import {
  Attribute,
  FieldType,
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
  MapWidgetRelationLayerOptions,
  MapWMSLayerLayerOptions,
  MapWMTSLayerLayerOptions,
  PryGeoAuthService,
  ResultSet
} from '@provoly/dashboard';
import { Feature, Map } from 'ol';
import { getTopLeft, getWidth } from 'ol/extent';
import { GeoJSON, MVT } from 'ol/format';
import { Geometry } from 'ol/geom';
import { Heatmap, Tile } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Cluster, TileWMS, Vector, WMTS, XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import VectorTile from 'ol/source/VectorTile';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {
  DEFAULT_HEATMAP_RADIUS,
  DEFAULT_RADIUS_INTENSITY_FACTOR,
  DEFAULT_ZOOM_MAX,
  DEFAULT_ZOOM_MIN,
  getCircleFeatureFromItem,
  getFeatureFromItem
} from '../utils/widget-map.utils';

export type AttributesForClass = {
  [key: string]: {
    intensityAttribute: Attribute;
    locationAttribute: Attribute;
  };
};

export type ItemStyles = { [id: string]: { classic: Style; bordered: Style } };

@Injectable({
  providedIn: 'root'
})
export class WidgetMapLayerService {
  styleCache: any = {};

  circleStyle = new Style({
    fill: new Fill({
      color: 'rgba(37,89,163,0.24)'
    }),
    stroke: new Stroke({
      color: 'rgb(37,89,163)',
      width: 2
    })
  });
  selectedCircleStyle = new Style({
    fill: new Fill({
      color: 'rgba(37,163,58,0.24)'
    }),
    stroke: new Stroke({
      color: 'rgb(37,163,58)',
      width: 2
    })
  });

  pointStyle = new Style({
    image: new Circle({
      fill: new Fill({ color: 'rgba(37,89,163,0.24)' }),
      stroke: new Stroke({ color: 'rgb(37,89,163)', width: 2 }),
      radius: 10
    })
  });
  selectedPointStyle = new Style({
    image: new Circle({
      fill: new Fill({ color: 'rgba(37,163,58,0.24)' }),
      stroke: new Stroke({ color: 'rgb(37,163,58)', width: 2 }),
      radius: 10
    })
  });
  geoAuthService?: PryGeoAuthService;

  withGeoAuth(geoAuthService: PryGeoAuthService) {
    this.geoAuthService = geoAuthService;
  }

  get implementationList() {
    return Object.keys(this.layersImplementation).filter((implementation) => implementation !== 'geoserver');
  }

  dontNeedLocation = ['relation', 'wms', 'wmts', 'geoserver', 'featurelayer', 'vectortile', 'rastertile'];
  dontNeedIntensity = [
    ...this.dontNeedLocation,
    'marker',
    'point',
    'line',
    'polygon',
    'multi-line',
    'multi-polygon',
    'auto'
  ];

  layersImplementation = {
    auto: (
      layer: MapAutoLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return this.layersImplementation[WidgetMapLayerService.translateFieldTypeToLayerType(layer.subType)](
        // @ts-ignore
        layer,
        attributesForClass,
        layerClassesId,
        resultSet,
        range,
        itemStyles,
        map
      ) as BaseLayer;
    },
    heatmap: (
      layer: MapWidgetHeatMapLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      const heatmap = new Heatmap({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new Vector({ attributions: [layer.attribution ?? ''] }),
        blur: (layer.radius ?? DEFAULT_HEATMAP_RADIUS) / 2,
        radius: layer.radius ?? DEFAULT_HEATMAP_RADIUS,
        weight: (feature: any) => {
          const value = ItemUtils.getAttributeCalculatedValue(
            feature,
            attributesForClass[feature.get('oClass') as string].intensityAttribute
          ) as number;
          const atScale = (value - range.min) / (range.max - range.min);
          return layer.intensityAsc ? atScale : 1 - atScale;
        }
      });

      layerClassesId.forEach((classId) => {
        (resultSet.items[classId] || [])
          .filter((item) => {
            const location = ItemUtils.readGeometry(item, 'point', attributesForClass[classId].locationAttribute);
            return !!location;
          })
          .forEach((item) => {
            heatmap
              .getSource()
              ?.addFeature(getFeatureFromItem(item, 'heatpoint', attributesForClass[item.oClass].locationAttribute));
          });
      });

      return heatmap as BaseLayer;
    },
    marker: (
      layer: MapWidgetMarkerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      const vectorLayer = new VectorLayer({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new VectorSource({ attributions: [layer.attribution ?? ''] })
      });

      layerClassesId.forEach((classId) => {
        (resultSet.items[classId] || [])
          .filter((item) => {
            const location = ItemUtils.readGeometry(item, 'point', attributesForClass[item.oClass].locationAttribute);
            return !!location;
          })
          .forEach(async (item) => {
            const itemFeature = getFeatureFromItem(
              item,
              'marker',
              attributesForClass[item.oClass].locationAttribute,
              itemStyles[item.id]?.classic,
              itemStyles[item.id]?.bordered
            );
            itemFeature.setStyle(itemFeature.get('classicStyle'));
            vectorLayer.getSource()?.addFeature(itemFeature);
          });
      });

      return this.makeClustered(vectorLayer, layer);
    },
    point: (
      layer: MapWidgetMarkerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return this.layerFromGeoJsonGeometry(layer, layerClassesId, resultSet, attributesForClass, 'point');
    },
    line: (
      layer: MapWidgetMarkerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return this.layerFromGeoJsonGeometry(layer, layerClassesId, resultSet, attributesForClass, 'line');
    },
    'multi-line': (
      layer: MapWidgetMarkerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return this.layerFromGeoJsonGeometry(layer, layerClassesId, resultSet, attributesForClass, 'multi-line');
    },
    polygon: (
      layer: MapWidgetMarkerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return this.layerFromGeoJsonGeometry(layer, layerClassesId, resultSet, attributesForClass, 'polygon');
    },
    'multi-polygon': (
      layer: MapWidgetMarkerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return this.layerFromGeoJsonGeometry(layer, layerClassesId, resultSet, attributesForClass, 'multi-polygon');
    },
    bubble: (
      layer: MapWidgetBubbleLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      const bubbleLayer = new VectorLayer({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new VectorSource({ attributions: [layer.attribution ?? ''] })
      });

      layerClassesId.forEach((classId) => {
        (resultSet.items[classId] || [])
          .filter((item) => {
            const location = ItemUtils.readGeometry(item, 'point', attributesForClass[item.oClass].locationAttribute);
            return !!location;
          })
          .forEach((item) => {
            const value = ItemUtils.getAttributeCalculatedValue(
              item,
              attributesForClass[item.oClass].intensityAttribute
            ) as number;
            const atScale = (value - range.min) / (range.max - range.min);
            const itemFeature = getCircleFeatureFromItem(
              item,
              attributesForClass[item.oClass].locationAttribute,
              (layer.intensityAsc ? atScale : 1 - atScale) * (layer.radiusFactor ?? DEFAULT_RADIUS_INTENSITY_FACTOR),
              this.circleStyle,
              this.selectedCircleStyle
            );
            itemFeature.setStyle(itemFeature.get('classicStyle'));
            bubbleLayer.getSource()?.addFeature(itemFeature);
          });
      });

      return bubbleLayer;
    },
    relation: (
      layer: MapWidgetRelationLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return new VectorLayer({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new VectorSource({ attributions: [layer.attribution ?? ''] })
      });
    },
    wms: (
      layer: MapWMSLayerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      const impl = new Tile({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new TileWMS({
          attributions: [layer.attribution ?? ''],
          crossOrigin: 'anonymous',
          url: layer.url,
          tileLoadFunction: (tile: any, str: string) => this.geoAuthService?.customLoader(tile, str),
          params: { LAYERS: layer.paramLayer, TILED: layer.paramTiled, ...(layer.additionalParameters ?? {}) }
        })
      });
      impl.set('url', layer.url);
      impl.set('paramLayer', layer.paramLayer);
      impl.set('oClass', layer.oClass);
      impl.set('getFeatureInfoAdditionalParameters', layer.getFeatureInfoAdditionalParameters ?? {});
      return impl;
    },
    wmts: (
      layer: MapWMTSLayerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      const projection = map.getView().getProjection();
      const projectionExtent = projection.getExtent();
      const size = getWidth(projectionExtent) / 256;
      const resolutions = new Array(19);
      const matrixIds = new Array(19);
      for (let z = 0; z < 19; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
      }
      return new Tile({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new WMTS({
          attributions: [layer.attribution ?? ''],
          crossOrigin: 'anonymous',
          url: layer.url,
          layer: layer.paramLayer,
          matrixSet: layer.matrixSet,
          projection,
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
          }),
          style: layer.style
        })
      });
    },
    geoserver: (
      layer: MapGeoServerLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      const impl = this.layersImplementation['wms'](
        { ...layer, type: 'wms', oClass: layer.oClass },
        attributesForClass,
        layerClassesId,
        resultSet,
        range,
        itemStyles,
        map
      );
      impl.set('title', layer.title);
      impl.set('oClass', layer.oClass);
      impl.set('datasourceId', layer.datasourceId);
      return impl;
    },
    featurelayer: (
      layer: MapFeatureLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return new VectorLayer({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new VectorSource({
          attributions: [layer.attribution ?? ''],
          format: new GeoJSON(),
          url: layer.url
        })
      });
    },
    vectortile: (
      layer: MapVectorTileLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return new VectorTileLayer({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new VectorTile({
          attributions: [layer.attribution ?? ''],
          format: new MVT(),
          url: layer.url
        })
      });
    },
    rastertile: (
      layer: MapRasterTileLayerOptions,
      attributesForClass: AttributesForClass,
      layerClassesId: string[],
      resultSet: ResultSet,
      range: { min: number; max: number },
      itemStyles: ItemStyles,
      map: Map
    ) => {
      return new Tile({
        minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
        maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
        opacity: (layer.opacity ?? 100) / 100,
        source: new XYZ({
          url: layer.url,
          attributions: [layer.attribution ?? '']
        })
      });
    }
  };

  private layerFromGeoJsonGeometry(
    layer: MapWidgetMarkerLayerOptions,
    layerClassesId: string[],
    resultSet: ResultSet,
    attributesForClass: AttributesForClass,
    type: 'point' | 'line' | 'multi-line' | 'polygon' | 'multi-polygon'
  ) {
    const vectorLayer = new VectorLayer({
      minZoom: layer.minZoom ?? DEFAULT_ZOOM_MIN,
      maxZoom: layer.maxZoom ?? DEFAULT_ZOOM_MAX,
      opacity: (layer.opacity ?? 100) / 100,
      source: new VectorSource({ attributions: [layer.attribution ?? ''] })
    });

    layerClassesId.forEach((classId) => {
      (resultSet.items[classId] || [])
        .map((item) => ({
          item,
          location: ItemUtils.readGeometry(item, type, attributesForClass[item.oClass].locationAttribute)
        }))
        .filter(({ location }) => !!location)
        .forEach(async (subItem) => {
          const itemFeature = new Feature({
            ...subItem.item,
            type,
            geometry: subItem.location,
            classicStyle: type === 'point' ? this.pointStyle : this.circleStyle,
            selectedStyle: type === 'point' ? this.selectedPointStyle : this.selectedCircleStyle
          });
          itemFeature.setStyle(itemFeature.get('classicStyle'));
          vectorLayer.getSource()?.addFeature(itemFeature);
        });
    });

    return this.makeClustered(vectorLayer, layer);
  }

  private makeClustered(layer: BaseLayer, layerOptions: MapWidgetLayerOptions) {
    if (!['marker', 'bubble'].includes(layerOptions.type) || !('clustered' in layerOptions && layerOptions.clustered)) {
      return layer;
    }
    // Clustering source
    const vectorLayer = layer as VectorLayer<VectorSource<Geometry>>;
    vectorLayer.setSource(
      new Cluster({
        distance: layerOptions.clusterDistance,
        minDistance: 10,
        source: vectorLayer.getSource() as VectorSource
      })
    );

    vectorLayer.setStyle((feature) => {
      const size = feature.get('features').length;
      if (size > 1) {
        let style = this.styleCache[size];
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff'
              }),
              fill: new Fill({
                color: '#3399CC'
              })
            }),
            text: new Text({ text: `${size}` })
          });
          this.styleCache[size] = style;
        }
        return style;
      } else {
        return size === 1 ? feature.get('features')[0].get('classicStyle') : null;
      }
    });

    return layer;
  }

  static translateFieldTypeToLayerType(subType: string) {
    switch (subType) {
      case FieldType.POINT:
        return 'marker';
      case FieldType.LINE:
        return 'line';
      case FieldType.POLYGON:
        return 'polygon';
      case FieldType.MULTILINE:
        return 'multi-line';
      case FieldType.MULTIPOLYGON:
        return 'multi-polygon';
      default:
        console.warn(`wrong type ${subType} for auto options`);
        return 'marker';
    }
  }
}
