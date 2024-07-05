import { Injectable } from '@angular/core';
import {
  Attribute,
  Class,
  Condition,
  Field,
  FieldType,
  MonoClassConditions,
  MonoClassSearchPayload,
  NamedQueryTypes,
  NormalizedCondition,
  OrderValue,
  ResultOrder
} from '@provoly/dashboard';
import { v4 as uuidV4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SearchMonoClassService {
  initNormalizedConditionComposed(parentId: string | null): NormalizedCondition {
    const id = uuidV4();
    return {
      id,
      parentId,
      type: 'AND'
    } as NormalizedCondition;
  }

  initNormalizedConditionAttribute(parentId: string, attributeId: string): NormalizedCondition {
    if (!attributeId.trim()) {
      throw new Error('Invalid attribute ID');
    }
    const id = uuidV4();
    return {
      id,
      parentId,
      attribute: attributeId,
      type: 'ATTRIBUTE',
      operator: 'EQUALS'
    } as NormalizedCondition;
  }

  buildMonoClassSearchPayloadForSearch(
    oClass: string,
    masterId: string,
    monoClassConditions: MonoClassConditions,
    order: ResultOrder | undefined
  ): MonoClassSearchPayload {
    if (!oClass.trim()) {
      throw new Error('Invalid class ID');
    }
    const condition = this.buildConditionFromMonoClassSearchCondition(monoClassConditions, masterId);
    let sort = undefined as { [key: string]: any } | undefined;
    if (order) {
      sort = {
        attribute: order.attribute,
        direction: order.asc
      };
    }
    return { type: NamedQueryTypes.MONO_CLASS, ...{ condition }, ...{ sort }, oClass } as MonoClassSearchPayload;
  }

  private buildConditionFromMonoClassSearchCondition(
    monoClassConditions: MonoClassConditions,
    idCondition: string
  ): Condition {
    const cond: NormalizedCondition = monoClassConditions.entities[idCondition];
    const subCond: Condition[] =
      monoClassConditions.entities[idCondition].composed?.map((id: string) =>
        this.buildConditionFromMonoClassSearchCondition(monoClassConditions, id)
      ) ?? [];
    const condition = {
      type: cond.type,
      attribute: cond.attribute,
      composed: subCond.length > 0 ? subCond : undefined,
      operator: cond.operator,
      value: cond.value,
      upperValue: cond.upperValue
    };
    if (condition.operator !== 'INSIDE' && condition.operator !== 'OUTSIDE') {
      delete condition.upperValue;
    }
    return condition;
  }

  loadNormalizedConditions(
    cond: Condition,
    parentId: string,
    classes: Class[],
    fields: Field[],
    masterId?: string,
    sort?: { attribute: string; direction: string }
  ): { id: string; conditions: NormalizedCondition[]; sort: ResultOrder | undefined } {
    let resultSort = undefined as ResultOrder | undefined;
    if (sort) {
      resultSort = {
        attribute: sort.attribute,
        asc: sort.direction as OrderValue
      };
    }
    if (cond?.type === 'AND' || cond?.type === 'OR') {
      const id = masterId ?? uuidV4();
      if (cond?.composed) {
        const children = cond.composed.map((cond) => this.loadNormalizedConditions(cond, id, classes, fields));
        const ids = children.map((child) => child.id);
        const normalizedChildren = children.reduce(
          (acc, res) => [...acc, ...res.conditions],
          [] as NormalizedCondition[]
        );
        return {
          id,
          conditions: [
            ...normalizedChildren,
            {
              id,
              parentId: parentId ?? null,
              type: cond.type,
              composed: ids
            }
          ],
          sort: resultSort
        };
      }
      return {
        id,
        conditions: [
          {
            id,
            parentId: parentId ?? null,
            type: cond.type
          }
        ],
        sort: resultSort
      };
    } else {
      const id = masterId ?? uuidV4();
      const field = this.getFieldFromAttribute(cond?.attribute, classes);
      const condition: NormalizedCondition = field
        ? {
            id,
            parentId: parentId ?? null,
            type: 'ATTRIBUTE',
            attribute: cond.attribute,
            operator: cond.operator,
            value: cond.value,
            pattern: this.getPatternForField(field),
            isDate: field.type === FieldType.INSTANT
          }
        : {
            id,
            parentId: parentId ?? null,
            type: 'ATTRIBUTE',
            attribute: cond?.attribute,
            operator: cond?.operator,
            value: cond?.value
          };
      return {
        id,
        conditions: [condition],
        sort: resultSort
      };
    }
  }

  getPatternForField(field: Field): string {
    const type = field.type;
    switch (type) {
      case FieldType.DECIMAL:
        return '^[+-]?([0-9]*[.])?[0-9]+$';
      case FieldType.INTEGER:
      case FieldType.LONG:
        return '^[+-]?[0-9]+$';
      case FieldType.STRING:
      case FieldType.KEYWORD:
        return '^.+$';
      case FieldType.INSTANT:
        return '^[0-9]{4}-[0-9]{2}-[0-9]{2}$|^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$';
      default:
        return '^.+$';
    }
  }

  private getFieldFromAttribute(attributeId: string | undefined, classes: Class[]): Field | undefined {
    if (!attributeId) {
      return undefined;
    }
    return classes
      .reduce((acc, clazz) => [...acc, ...clazz.attributes], [] as Attribute[])
      .find((a) => a.id === attributeId)?.field;
  }
}
