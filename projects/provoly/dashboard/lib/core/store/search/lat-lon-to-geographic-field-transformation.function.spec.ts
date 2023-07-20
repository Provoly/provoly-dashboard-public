import {
  AttributeSimpleValue,
  FieldType,
  Item,
  latLonToGeographicFieldTransformation,
  ResultSet
} from '@provoly/dashboard';

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

const rs = { items: { aaa: [item, { ...item, id: 'b' }] }, relations: [] } as ResultSet;

describe('latLonToGeographicFieldTransformation function', () => {
  it('should create new field for all items', () => {
    expect(latLonToGeographicFieldTransformation('lat', 'lng', 'location-auto')('aaa', rs)).toEqual({
      items: {
        aaa: [
          {
            ...item,
            attributes: {
              ...item.attributes,
              'location-auto': {
                type: 'VALUE',
                value: { coordinates: [-0.88, 44.5], type: FieldType.POINT },
                visible: true
              }
            }
          },
          {
            ...item,
            id: 'b',
            attributes: {
              ...item.attributes,
              'location-auto': {
                type: 'VALUE',
                value: { coordinates: [-0.88, 44.5], type: FieldType.POINT },
                visible: true
              }
            }
          }
        ]
      },
      relations: []
    });
  });

  it('should ignore dataset accordingly', () => {
    expect(latLonToGeographicFieldTransformation('lat', 'lng', 'location-auto', ['bbb'])('aaa', rs)).toEqual(rs);
  });

  it('should ignore item missing some attribute', () => {
    const itemWithoutLat = { ...item, attributes: { ...item.attributes } };
    delete itemWithoutLat.attributes['lat'];

    expect(
      latLonToGeographicFieldTransformation(
        'lat',
        'lng',
        'location-auto'
      )('aaa', {
        items: {
          aaa: [item, itemWithoutLat]
        },
        relations: []
      })
    ).toEqual({
      items: {
        aaa: [
          {
            ...item,
            attributes: {
              ...item.attributes,
              'location-auto': {
                type: 'VALUE',
                value: { coordinates: [-0.88, 44.5], type: FieldType.POINT },
                visible: true
              }
            }
          },
          itemWithoutLat
        ]
      },
      relations: []
    });
  });

  it('should manage text lat/lng', () => {
    rs.items['aaa'].forEach((item) => {
      (item.attributes['lat'] as AttributeSimpleValue).value += '';
      (item.attributes['lng'] as AttributeSimpleValue).value += '';
    });
    expect(latLonToGeographicFieldTransformation('lat', 'lng', 'location-auto')('aaa', rs)).toEqual({
      items: {
        aaa: [
          {
            ...item,
            attributes: {
              ...item.attributes,
              'location-auto': {
                type: 'VALUE',
                value: { coordinates: [-0.88, 44.5], type: FieldType.POINT },
                visible: true
              }
            }
          },
          {
            ...item,
            id: 'b',
            attributes: {
              ...item.attributes,
              'location-auto': {
                type: 'VALUE',
                value: { coordinates: [-0.88, 44.5], type: FieldType.POINT },
                visible: true
              }
            }
          }
        ]
      },
      relations: []
    });
  });
});
