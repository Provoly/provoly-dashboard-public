import { AttributeSimpleValue, Item } from '../../model/item.interface';
import { ResultSet } from '../../model/result-set.interface';
import { FieldType } from '../field/field.interface';

export const latLonToGeographicFieldTransformation =
  (latAttrName: string, lonAttrName: string, locAttrName: string, datasetIds: string[] = []) =>
  (id: string, result: ResultSet) => {
    if (datasetIds.length > 0 && !datasetIds.includes(id)) {
      return result;
    }

    const targetResultSet = { ...result } as ResultSet;
    Object.keys(result.items).forEach((classId) => {
      targetResultSet.items[classId] = [
        ...result.items[classId].map((item) => {
          if (!item.attributes[latAttrName] || !item.attributes[lonAttrName]) {
            return item;
          }

          return {
            ...item,
            attributes: {
              ...item.attributes,
              [locAttrName]: {
                type: 'VALUE',
                visible: true,
                value: {
                  type: FieldType.POINT,
                  coordinates: [
                    parseFloat((item.attributes[lonAttrName] as AttributeSimpleValue).value + ''),
                    parseFloat((item.attributes[latAttrName] as AttributeSimpleValue).value + '')
                  ]
                }
              }
            }
          } as Item;
        })
      ];
    });
    return targetResultSet;
  };
