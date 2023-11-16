import { AttributeMultipleValue, AttributeSimpleValue, Item, ValueType } from '../core/model/item.interface';
import { ResultSet } from '../core/model/result-set.interface';
import { Attribute, Class } from '../core/store/class/class.interface';
import { Field } from '../core/store/field/field.interface';

export interface OlFeature {
  get(key: string): any;
}

const hiddenFieldText = '*********';

export class ItemUtils {
  static getAttributeValue(
    item: Item | OlFeature,
    attribute: Attribute | string | undefined
  ): AttributeSimpleValue | AttributeSimpleValue[] {
    if (!attribute) {
      return undefined as unknown as AttributeSimpleValue;
    }
    if (typeof attribute === 'string') {
      // @ts-ignore
      return !!item.get ? item.get(attribute) : item.attributes[attribute];
    }
    if (attribute.multiValued) {
      return (
        (
          (!item.hasOwnProperty('oClass')
            ? (item as OlFeature).get('attributes')[attribute.name] ?? {}
            : ((item as Item).attributes[attribute.name] as AttributeMultipleValue)) ?? {}
        ).values ?? []
      )
        .map((v: AttributeSimpleValue) => ({ ...v, value: v.visible ? v.value : hiddenFieldText }))
        .sort(ItemUtils.sortAttributes);
    }
    return (
      !item.hasOwnProperty('oClass')
        ? (item as OlFeature).get('attributes')[attribute.name]
        : (item as Item).attributes[attribute.name]
    ) as AttributeSimpleValue;
  }

  static getAttributeCalculatedValue(item: Item, attribute: Attribute | string | undefined): ValueType | ValueType[] {
    if (!attribute) {
      return undefined as unknown as ValueType;
    }
    if (typeof attribute === 'string') {
      // @ts-ignore
      return item[attribute];
    }
    if (attribute.multiValued) {
      return (ItemUtils.getAttributeValue(item, attribute) as AttributeSimpleValue[]).map((v) => v.value);
    }
    const value = ItemUtils.getAttributeValue(item, attribute) as AttributeSimpleValue;
    return value ? (value.visible ? value.value : hiddenFieldText) : (undefined as unknown as ValueType);
  }

  static sortAttributes(a: AttributeSimpleValue, b: AttributeSimpleValue): number {
    const compareVisible = (b.visible ? 1 : -1) - (a.visible ? 1 : -1);
    if (compareVisible !== 0) {
      return compareVisible;
    }
    return (
      (b?.metadata ? (b?.metadata['_modification_date'] as number) ?? 0 : 0) -
      (a?.metadata ? (a?.metadata['_modification_date'] as number) ?? 0 : 0)
    );
  }

  static pertinentValue(items: Item[], attr: Attribute) {
    return items
      .map((item) => ItemUtils.getAttributeCalculatedValue(item, attr))
      .filter((value) => typeof value === 'number')
      .map((value) => value as number);
  }

  static isLocation(tuple: any[]) {
    return !!tuple[0] && !!tuple[1] && typeof tuple[0] === 'number' && typeof tuple[1] === 'number';
  }

  static getAttributesFromAvailabilityInResultSet(resultSet: ResultSet) {
    return [
      ...new Set(
        Object.keys(resultSet?.items || {})
          .map((classId) =>
            resultSet.items[classId].map((item) => [...Object.keys(item), ...Object.keys(item.attributes)])
          )
          .reduce((prev, curr) => [...prev, ...curr], [])
          .reduce((prev, curr) => [...prev, ...curr], [])
          .filter((prop) => prop !== 'attributes')
      )
    ];
  }

  static findInResultSet(resultSet: ResultSet, id: string): Item {
    return (
      Object.keys(resultSet.items)
        .map((classId) => resultSet.items[classId].filter((item) => item.id === id))
        .reduce((p, c) => [...p, ...c], []) as Item[]
    ).find((item) => !!item) as Item;
  }

  static getFieldsFromAvailabilityInResultSet(resultSet: ResultSet, classes: Class[], fields: Field[]): Field[] {
    return [
      ...new Set(
        Object.keys(resultSet?.items || {})
          .map((classId) => classes.find((cl) => cl.id === classId) as Class)
          .filter((oClass) => oClass !== undefined)
          .map((oClass: Class) =>
            fields
              .filter((f) => oClass.attributes.map((attr) => attr.field).includes(f.id))
              .filter((f) => f !== undefined)
          )
          .reduce((p: Field[], c: Field[]) => [...p, ...c], [])
      )
    ];
  }

  static hasLocation(clazz: Class) {
    return true;
  }

  static isValidObject(object: Item) {
    return object.oClass && object.oClass.length > 0;
  }

  static getAttributesFromRs(
    resultSet: ResultSet,
    classes: Class[],
    fields: Field[],
    defs?: { [key: string]: string[] }
  ): Attribute[] {
    const definitions = defs ?? {};
    return [
      ...new Set(
        Object.keys(resultSet?.items || {})
          .map((classId) => classes.find((cl) => cl.id === classId) as Class)
          .filter((oClass) => oClass !== undefined)
          .map((oClass) =>
            oClass.attributes.filter((attr) =>
              ItemUtils.getAttributesDefinitionForClass(oClass, definitions).includes(attr.name)
            )
          )
          .reduce((p, c) => [...p, ...c], [])
          .filter((attr: Attribute) => !!fields.find((f) => f.id === attr.field))
      )
    ];
  }

  static getAttributesDefinitionForClass(clazz: Class, defs: { [key: string]: string[] }) {
    return defs[clazz.id ?? ''] ?? (clazz ?? { attributes: [] }).attributes.map((attr) => attr.name);
  }

  static ensureItemIdHasCorrectFormat(item: Item): Item {
    if (!item.id.includes('@')) {
      item.id = `${item.oClass}@${item.id}`;
    }
    return item;
  }

  static simpleArrayEquals(a: any[], b: any[]) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
  }
}
