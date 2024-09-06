import { Attribute, Class, Field, FieldType, ResultSet } from '@provoly/dashboard';
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
          field: { id: 'a', name: 'a', type: FieldType.STRING },
          multiValued: false
        })
      ).toEqual('a');
      expect(
        ItemUtils.getAttributeCalculatedValue(item, {
          id: 'sxxx',
          name: 'integer',
          technicalName: 'integer',
          field: { id: 'b', name: 'b', type: FieldType.STRING },
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
          field: { id: 'a', name: 'a', type: FieldType.STRING },
          multiValued: false
        })
      ).toEqual('a');
      expect(
        ItemUtils.getAttributeCalculatedValue(item, {
          id: 'sxxx',
          name: 'multi',
          technicalName: 'multi',
          field: { id: 'b', name: 'b', type: FieldType.STRING },
          multiValued: true
        })
      ).toEqual([44.6, -0.89]);
    });
  });

  it('should get default attributes from Rs', () => {
    const resultSet: ResultSet = {
      items: { fakeClassId: [item] },
      relations: [],
      autoRefreshInterval: undefined,
      merged: undefined,
      count: undefined
    };
    const expectedAttributesFiltered: Attribute[] = [
      {
        id: 'sxxx',
        name: 'chaine',
        technicalName: 'string',
        field: { id: 'a', name: 'a', type: FieldType.STRING },
        multiValued: false
      },
      {
        id: 'dxxx',
        name: 'décimale',
        technicalName: 'decimal',
        field: { id: 'c', name: 'c', type: FieldType.DECIMAL },
        multiValued: false
      }
    ];
    const allAtributes: Attribute[] = [
      ...expectedAttributesFiltered,
      {
        id: 'ixxx',
        name: 'entier',
        technicalName: 'integer',
        field: { id: 'b', name: 'b', type: FieldType.INTEGER },
        multiValued: false
      }
    ];
    const clazz: Class = {
      id: 'fakeClassId',
      name: 'fakeClassName',
      attributes: allAtributes
    };
    const fields: Field[] = [
      { id: 'a', name: 'a', type: FieldType.STRING },
      {
        id: 'b',
        name: 'b',
        type: FieldType.INTEGER
      },
      { id: 'c', name: 'c', type: FieldType.DECIMAL }
    ];
    const defs: { [key: string]: string[] } = { fakeClassId: ['chaine', 'décimale'] };

    expect(ItemUtils.getAttributesFromRs(resultSet, [clazz], fields, defs)).toEqual(expectedAttributesFiltered);
    expect(ItemUtils.getAttributesFromRs(resultSet, [clazz], fields, undefined)).toEqual(allAtributes);
  });
});
