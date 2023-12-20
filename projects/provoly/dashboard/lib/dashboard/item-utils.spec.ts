import { FieldType } from '@provoly/dashboard';
import { Item } from '../core/model/item.interface';
import { ItemUtils } from './item-utils';

const item: Item = {
  id: 'a',
  oClass: 'aaa',
  attributes: {
    integer: { value: 5, type: 'VALUE', visible: true },
    decimal: { value: 3.4, type: 'VALUE', visible: true },
    string: { value: 'a', type: 'VALUE', visible: true },
    lat: { value: 44.5, type: 'VALUE', visible: true },
    lng: { value: -0.88, type: 'VALUE', visible: true },
    location: {
      type: 'VALUE',
      value: {
        type: FieldType.POINT,
        coordinates: [44.6, -0.89]
      },
      visible: true
    },
    multi: {
      type: 'MULTI',
      values: [
        { value: 44.6, type: 'VALUE', visible: true },
        { value: -0.89, type: 'VALUE', visible: true }
      ]
    }
  }
};

describe('ItemUtils functions', () => {
  describe('getAttributeCalculatedValue', () => {
    it('should allow to correctly read values in item', () => {
      expect(
        ItemUtils.getAttributeCalculatedValue(item, {
          id: 'sxxx',
          name: 'string',
          technicalName: 'string',
          field: 'a',
          multiValued: false
        })
      ).toEqual('a');
      expect(
        ItemUtils.getAttributeCalculatedValue(item, {
          id: 'sxxx',
          name: 'integer',
          technicalName: 'integer',
          field: 'b',
          multiValued: false
        })
      ).toEqual(5);
    });
    it('should allow to correctly read multivalued values in item', () => {
      expect(
        ItemUtils.getAttributeCalculatedValue(item, {
          id: 'sxxx',
          name: 'string',
          technicalName: 'string',
          field: 'a',
          multiValued: false
        })
      ).toEqual('a');
      expect(
        ItemUtils.getAttributeCalculatedValue(item, {
          id: 'sxxx',
          name: 'multi',
          technicalName: 'multi',
          field: 'b',
          multiValued: true
        })
      ).toEqual([44.6, -0.89]);
    });
  });
});
