import { Class, Field, FilterContext, TextFieldTypes } from '@provoly/dashboard';

export class CqlUtils {
  static getCQLParamsFor(
    datasourceId: string,
    filters: { [p: string]: FilterContext[] },
    classes: Class[],
    fields: Field[]
  ): string | null {
    if (!filters || !datasourceId || !filters[datasourceId] || filters[datasourceId].length === 0) {
      return null;
    }

    const attributesReference = classes.map((clazz) => clazz.attributes).flat();

    return filters[datasourceId]
      .map((cond) => {
        const attribute = attributesReference.find((attr) => attr.id === cond.attribute);
        const field = fields.find((f) => f.id === attribute?.field);
        const attributeName = attribute?.technicalName;

        return this.getConditionsForValue(attributeName, cond, field, datasourceId);
      })
      .filter((conds) => conds.length > 0)
      .join(' AND ');
  }

  static getConditionsForValue(
    attributeName: string | undefined,
    cond: FilterContext,
    field: Field | undefined,
    datasourceId: string
  ) {
    let conditions: string[] = [];

    const values = (Array.isArray(cond.value) ? cond.value : [cond.value]) as string[] | number[];

    if (attributeName) {
      values.forEach((value) => {
        if (value && (typeof value !== 'string' || value.length > 0)) {
          const quoteSafeValue = `${value}`.replace(/'/g, "''");
          switch (cond.operator) {
            case 'EQUALS':
              if (!field || TextFieldTypes.includes(field?.type)) {
                conditions.push(`${attributeName}='${quoteSafeValue}'`);
              } else {
                conditions.push(`${attributeName}=${value}`);
              }
              break;
            case 'CONTAINS':
              conditions.push(`${attributeName} LIKE '%${quoteSafeValue}%'`);
              break;
            case 'START_WITH':
              conditions.push(`${attributeName} LIKE '${quoteSafeValue}%'`);
              break;
            case 'END_WITH':
              conditions.push(`${attributeName} LIKE '%${quoteSafeValue}'`);
              break;
            case 'GREATER_THAN':
              conditions.push(`${attributeName}>${value}`);
              break;
            case 'LOWER_THAN':
              conditions.push(`${attributeName}<${value}`);
              break;
            case 'OUTSIDE':
              const splitI = (value as string)?.split(',');
              if (splitI && splitI.length > 1) {
                conditions.push(`( ${attributeName}<${splitI[0]} AND ${attributeName}>${splitI[1]} )`);
              }
              break;
            case 'INSIDE':
              const splitO = (value as string)?.split(',');
              if (splitO && splitO.length > 1) {
                conditions.push(`( ${attributeName}>${splitO[0]} AND ${attributeName}<${splitO[1]} )`);
              }
              break;
          }
        }
      });
    } else {
      console.warn(
        `Cannot add cql filter on datasource ${datasourceId} because ${cond.attribute} attribute not found in classes`
      );
    }

    return conditions.length > 1 ? '( ' + conditions.join(' OR ') + ' )' : conditions[0];
  }
}
