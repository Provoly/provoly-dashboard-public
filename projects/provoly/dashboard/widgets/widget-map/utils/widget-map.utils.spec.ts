import {
  BaseWidgetMapLayerOptions,
  Class,
  Field,
  FieldType,
  MapWidgetLayerOptions,
  ResultSet
} from '@provoly/dashboard';
import { getLayerOrder, populateIntensityAttribute, populateLocationAttribute } from './widget-map.utils';

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

const layers = [
  [
    { type: 'heatmap', order: 1 },
    { type: 'point', order: undefined },
    { type: 'line', order: 3 },
    { type: 'marker', order: 5 }
  ],
  [
    { type: 'bubble', order: 10 },
    { type: 'point', order: undefined },
    { type: 'marker', order: undefined }
  ],
  [
    { type: 'bubble', order: undefined },
    { type: 'point', order: undefined },
    { type: 'marker', order: 1 }
  ],
  [
    { type: 'bubble', order: undefined },
    { type: 'marker', order: 1 },
    { type: 'point', order: undefined },
    { type: 'line', order: 5 },
    { type: 'marker', order: undefined }
  ],
  [
    { type: 'bubble', order: 11 },
    { type: 'point', order: undefined },
    { type: 'marker', order: 1 }
  ]
] as MapWidgetLayerOptions[][];

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
    describe('valid test cases', () => {
      test.each([
        [layers[0][1], 1, layers[0], 2],

        [layers[1][1], 1, layers[1], 11],
        [layers[1][2], 2, layers[1], 12],

        [layers[2][0], 0, layers[2], 0],
        [layers[2][1], 1, layers[2], 0.5],

        [layers[3][0], 0, layers[3], 0],
        [layers[3][2], 2, layers[3], 3],
        [layers[3][4], 4, layers[3], 6]
      ])('should assign the layer order correctly', (layer, index, array, expected) => {
        const result = getLayerOrder(layer, index, array);
        expect(result).toEqual(expected);
      });
    });

    it('should console warn if one of the layers is out of order', () => {
      console.warn = jest.fn();
      const result = getLayerOrder(layers[4][1], 1, layers[4]);
      expect(result).toEqual(12);
      expect(console.warn).toHaveBeenCalledWith(
        "the order property of layer no 3 was preset but doesn't follow the order of the other layers"
      );
    });
  });
});
