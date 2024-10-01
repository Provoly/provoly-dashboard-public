import { CqlUtils } from '@provoly/dashboard/widgets/widget-map';
import { Class, Field, FieldType } from '@provoly/dashboard';

export const fields: Field[] = [
  { id: 'attr-field', name: 'fAttr', type: FieldType.STRING },
  { id: 'other-field', name: 'fOther', type: FieldType.INTEGER }
];

export const classes: Class[] = [
  {
    id: 'aaa',
    name: 'a',
    attributes: [
      {
        id: 'attribute',
        name: 'attribute',
        technicalName: 'attribute',
        field: fields[0],
        multiValued: false
      },
      {
        id: 'other',
        name: 'other',
        technicalName: 'other',
        field: fields[1],
        multiValued: false
      }
    ]
  }
];

describe('CqlUtils', () => {
  describe('getConditionsForValue', () => {
    it('should translate EQUALS condition', () => {
      expect(
        CqlUtils.getConditionsForValue(
          'name',
          { attribute: 'attribute', operator: 'EQUALS', value: 'value', type: 'text' },
          fields[0],
          'datasource'
        )
      ).toEqual("name='value'");
    });

    it('should translate INSIDE condition', () => {
      expect(
        CqlUtils.getConditionsForValue(
          'name',
          { attribute: 'attribute', operator: 'INSIDE', value: '1,2', type: 'number' },
          fields[1],
          'datasource'
        )
      ).toEqual('( name>1 AND name<2 )');
    });
  });

  describe('getCQLParamsFor', () => {
    it('should manage simple values', () => {
      expect(
        CqlUtils.getCQLParamsFor(
          'name',
          {
            name: [
              { attribute: 'attribute', operator: 'EQUALS', value: 'value', type: 'text' },
              { attribute: 'other', operator: 'EQUALS', value: 5, type: 'number' }
            ]
          },
          classes,
          fields
        )
      ).toEqual("attribute='value' AND other=5");
    });

    it('should manage multiple values', () => {
      expect(
        CqlUtils.getCQLParamsFor(
          'name',
          {
            name: [
              { attribute: 'attribute', operator: 'EQUALS', value: ['a', 'b'], type: 'text' },
              { attribute: 'other', operator: 'EQUALS', value: [1, 2], type: 'number' }
            ]
          },
          classes,
          fields
        )
      ).toEqual("( attribute='a' OR attribute='b' ) AND ( other=1 OR other=2 )");
    });

    it('should manage multiple values with INSIDE conditions', () => {
      expect(
        CqlUtils.getCQLParamsFor(
          'name',
          {
            name: [
              { attribute: 'attribute', operator: 'EQUALS', value: ['a', 'b'], type: 'text' },
              { attribute: 'other', operator: 'INSIDE', value: '1,2', type: 'number' }
            ]
          },
          classes,
          fields
        )
      ).toEqual("( attribute='a' OR attribute='b' ) AND ( other>1 AND other<2 )");
    });

    it('should manage multiple values with INSIDE conditions', () => {
      expect(
        CqlUtils.getCQLParamsFor(
          'name',
          {
            name: [
              { attribute: 'attribute', operator: 'CONTAINS', value: ['a', 'b'], type: 'text' },
              { attribute: 'other', operator: 'INSIDE', value: '1,2', type: 'number' }
            ]
          },
          classes,
          fields
        )
      ).toEqual("( attribute LIKE '%a%' OR attribute LIKE '%b%' ) AND ( other>1 AND other<2 )");
    });
  });
});
