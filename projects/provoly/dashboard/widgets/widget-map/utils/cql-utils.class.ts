import { Class, FilterContext } from '@provoly/dashboard';

export class CqlUtils {
  static getCQLParamsFor(
    datasourceId: string,
    filters: { [p: string]: FilterContext[] },
    classes: Class[]
  ): string | null {
    if (!filters || !datasourceId || !filters[datasourceId] || filters[datasourceId].length === 0) {
      return null;
    }

    const attributesReference = classes.map((clazz) => clazz.attributes).flat();

    return filters[datasourceId]
      .map((cond) => {
        const conditions = [];

        const attributeName = attributesReference.find((attr) => attr.id === cond.attribute)?.technicalName;

        if (attributeName && cond.value && (typeof cond.value !== 'string' || cond.value.length > 0)) {
          const quoteSafeValue = `${cond.value}`.replace(/'/g, "''");
          switch (cond.operator) {
            case 'EQUALS':
              conditions.push(`${attributeName}='${quoteSafeValue}'`);
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
              conditions.push(`${attributeName}>${cond.value}`);
              break;
            case 'LOWER_THAN':
              conditions.push(`${attributeName}<${cond.value}`);
              break;
            case 'INSIDE':
              const splitI = (cond.value as string)?.split(',');
              if (splitI && splitI.length > 1) {
                conditions.push(`${attributeName}<${splitI[0]}`);
                conditions.push(`${attributeName}>${splitI[1]}`);
              }
              break;
            case 'OUTSIDE':
              const splitO = (cond.value as string)?.split(',');
              if (splitO && splitO.length > 1) {
                conditions.push(`${attributeName}>${splitO[0]}`);
                conditions.push(`${attributeName}<${splitO[1]}`);
              }
              break;
          }
        } else {
          console.warn(
            `Cannot add cql filter on datasource ${datasourceId} because ${cond.attribute} attribute not found in classes`
          );
        }

        return conditions;
      })
      .filter((conds) => conds.length > 0)
      .join(' AND ');
  }
}
