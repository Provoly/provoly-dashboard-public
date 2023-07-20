import { Class, Field, FieldType, MapWidgetLayerOptions, ResultSet } from '@provoly/dashboard';
import { populateIntensityAttribute, populateLocationAttribute } from './widget-map.utils';

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
  }
] as Class[];

const fields = [
  { id: 'loc-xxxx', type: FieldType.POINT },
  { id: 'lat-xxxx', type: 'decimal' },
  { id: 'lng-xxxx', type: 'decimal' },
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
    it('should select latitude and latitude amonst a list', () => {
      const layer = { type: 'heatmap' } as MapWidgetLayerOptions;
      populateLocationAttribute(layer, rs, classes, fields);
      expect(layer).toEqual({ ...layer, attribute: 'loc' });
    });
  });
  describe('populateIntensityAttribute', () => {
    it('should select intensity amonst a list', () => {
      const layer = { type: 'heatmap' } as MapWidgetLayerOptions;
      populateLocationAttribute(layer, rs, classes, fields);
      populateIntensityAttribute(layer, rs, classes, fields);
      expect(layer).toEqual({ ...layer, attribute: 'loc', intensityAttribute: 'intensity' });
    });
  });
});
