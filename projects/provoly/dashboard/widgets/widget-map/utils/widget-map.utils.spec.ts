import { Class, Field, FieldType, MapWidgetLayerOptions, ResultSet } from '@provoly/dashboard';
import { assignLayersOrder, populateIntensityAttribute, populateLocationAttribute } from './widget-map.utils';

const rs = {
  items: {
    aaa: [
      {
        id: '1',
        oClass: 'aaa',
        attributes: {
          loc: { value: { type: FieldType.POINT, coordinates: [0, 0] }, type: 'VALUE', visible: true },
          lat: { value: 0, type: 'VALUE', visible: true },
          lng: { value: 0, type: 'VALUE', visible: true },
          intensity: { value: 8, type: 'VALUE', visible: true }
        }
      },
      {
        id: '2',
        oClass: 'aaa',
        attributes: {
          loc: { value: { type: FieldType.POINT, coordinates: [0, 0] }, type: 'VALUE', visible: true },
          lat: { value: 3, type: 'VALUE', visible: true },
          lng: { value: 3, type: 'VALUE', visible: true },
          intensity: { value: 9, type: 'VALUE', visible: true }
        }
      },
      {
        id: '3',
        oClass: 'aaa',
        attributes: {
          loc: { value: { type: FieldType.POINT, coordinates: [0, 0] }, type: 'VALUE', visible: true },
          lat: { value: 5, type: 'VALUE', visible: true },
          lng: { value: 5, type: 'VALUE', visible: true },
          intensity: { value: 10, type: 'VALUE', visible: true }
        }
      }
    ]
  },
  relations: []
} as ResultSet;

const classes = [
  {
    id: 'aaa',
    name: 'a',
    attributes: [
      { id: 'loc', name: 'loc', field: 'loc-xxxx' },
      { id: 'lat', name: 'lat', field: 'lat-xxxx' },
      { id: 'lng', name: 'lng', field: 'lng-xxxx' },
      { id: 'intensity', name: 'intensity', field: 'intensity-xxxx' }
    ]
  },
  {
    id: 'geoClass',
    name: 'geoClassName',
    attributes: [
      { id: 'loc', name: 'loc', field: 'loc-xxxx' },
      { id: 'lat', name: 'lat', field: 'lat-xxxx' },
      { id: 'lng', name: 'lng', field: 'lng-xxxx' },
      { id: 'zone', name: 'zone', field: 'zone' },
      { id: 'intensity', name: 'intensity', field: 'intensity-xxxx' }
    ]
  }
] as Class[];

const fields = [
  { id: 'loc-xxxx', type: FieldType.POINT },
  { id: 'lat-xxxx', type: 'decimal' },
  { id: 'lng-xxxx', type: 'decimal' },
  { id: 'zone', type: FieldType.MULTIPOLYGON },
  {
    id: 'intensity-xxxx',
    type: 'decimal'
  }
] as Field[];

export const mapUtilsData = {
  rs,
  fields,
  classes
};

describe('WidgetMapUtils functions', () => {
  describe('populateLocationAttribute', () => {
    it('should select latitude and latitude among a list', () => {
      const layer = { type: 'heatmap' } as MapWidgetLayerOptions;
      populateLocationAttribute(layer, rs, classes, fields);
      expect(layer).toEqual({ ...layer, attribute: 'loc' });
    });
  });
  describe('populateIntensityAttribute', () => {
    it('should select intensity among a list', () => {
      const layer = { type: 'heatmap' } as MapWidgetLayerOptions;
      populateLocationAttribute(layer, rs, classes, fields);
      populateIntensityAttribute(layer, rs, classes, fields);
      expect(layer).toEqual({ ...layer, attribute: 'loc', intensityAttribute: 'intensity' });
    });
  });

  describe('getLayerOrder', () => {
    it('order case 1', () => {
      expect(
        assignLayersOrder([
          { type: 'heatmap', order: 1 },
          { type: 'point', order: undefined },
          { type: 'line', order: 3 },
          { type: 'marker', order: 5 }
        ] as MapWidgetLayerOptions[])
      ).toEqual([
        { order: 1, type: 'heatmap' },
        { order: 2, type: 'point' },
        { order: 3, type: 'line' },
        { order: 5, type: 'marker' }
      ]);
    });

    it('order case 2', () => {
      expect(
        assignLayersOrder([
          { type: 'bubble', order: 10 },
          { type: 'point', order: undefined },
          { type: 'marker', order: undefined }
        ] as MapWidgetLayerOptions[])
      ).toEqual([
        { order: 10, type: 'bubble' },
        { order: 11, type: 'point' },
        { order: 12, type: 'marker' }
      ]);
    });

    it('order case 3', () => {
      expect(
        assignLayersOrder([
          { type: 'bubble', order: undefined },
          { type: 'point', order: undefined },
          { type: 'marker', order: 1 }
        ] as MapWidgetLayerOptions[])
      ).toEqual([
        { order: 0, type: 'bubble' },
        { order: 0.5, type: 'point' },
        { order: 1, type: 'marker' }
      ]);
    });

    it('order case 4', () => {
      expect(
        assignLayersOrder([
          { type: 'bubble', order: undefined },
          { type: 'marker', order: 1 },
          { type: 'point', order: undefined },
          { type: 'line', order: 5 },
          { type: 'marker', order: undefined }
        ] as MapWidgetLayerOptions[])
      ).toEqual([
        { order: 0, type: 'bubble' },
        { order: 1, type: 'marker' },
        { order: 3, type: 'point' },
        { order: 5, type: 'line' },
        { order: 6, type: 'marker' }
      ]);
    });

    it('order case 5', () => {
      expect(
        assignLayersOrder([{ type: 'bubble', background: true }, { type: 'point' }] as MapWidgetLayerOptions[])
      ).toEqual([
        { order: 0, type: 'point' },
        { background: true, order: 9999, type: 'bubble' }
      ]);
    });
  });
});
