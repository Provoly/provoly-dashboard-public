import { Injectable } from '@angular/core';
import {
  Class,
  Field,
  FieldType,
  MultiClassCondition,
  MultiClassField,
  MultiClassFieldSelection,
  MultiClassSearchPayload,
  NamedQueryTypes
} from '@provoly/dashboard';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class SearchMultiClassService {
  generateCondition(field?: string, operator?: string): MultiClassCondition {
    const id = uuidv4();
    return {
      id,
      field,
      operator: operator ? operator : field ? 'EQUALS' : null,
      value: field ? '' : null,
      isDate: false
    } as MultiClassCondition;
  }

  getConditionsFromSearchPayload(payload: MultiClassSearchPayload, fields: Field[]): MultiClassCondition[] {
    return payload.fields.map((item: any) => {
      const generatedCondition = this.generateCondition(item.field, item.operator);
      const field = fields.find((field) => field.id === item.field);
      if (!field) {
        return generatedCondition;
      }
      const pattern = this.getPatternForField(field);
      return {
        ...generatedCondition,
        value: item.value,
        pattern,
        isDate: field?.type === FieldType.INSTANT
      };
    });
  }

  buildConditionsToSearchPayload(
    conditions: MultiClassCondition[],
    classes: Class[],
    multiType: 'AND' | 'OR'
  ): MultiClassSearchPayload {
    const oClasses = this.getClassesIdsByConditions(conditions, classes);
    const fields = conditions.map(
      (c) =>
        ({
          field: c.field,
          operator: c.operator,
          value: c.value,
          upperValue: c.upperValue
        }) as MultiClassField
    );
    return {
      fullSearch: null,
      type: NamedQueryTypes.MULTI_CLASS,
      multiType,
      oClasses,
      fields: fields.map((f) => {
        if (f.operator === 'INSIDE' || f.operator === 'OUTSIDE') {
          return f;
        }
        const { upperValue, ...rest } = f;
        return rest;
      })
    };
  }

  getFieldsAvailable(
    conditions: MultiClassCondition[],
    classes: Class[],
    fields: Field[],
    excludedCondition?: string
  ): MultiClassFieldSelection[] {
    const selectedFields = this.getSelectedFields(conditions, excludedCondition);
    const availableClasses = this.getClassesIntersectFields(selectedFields, classes);

    const classesByFields: { [key: string]: string[] } = {};
    const availableFields = [
      ...new Set(
        availableClasses.reduce((acc: Field[], c: Class) => {
          const fieldsByClass = c.attributes
            .map((a) => fields.find((f) => f.id === a.field.id))
            .filter((f): f is Field => f !== undefined);
          fieldsByClass.forEach((f) => {
            classesByFields[f.id] = classesByFields[f.id] ? [...classesByFields[f.id], c.name] : [c.name];
          });
          return [...acc, ...fieldsByClass];
        }, [])
      )
    ];

    return availableFields.map((f) => ({
      id: f.id,
      name: f.name,
      classes: classesByFields[f.id]
    }));
  }

  getClassesForField(
    conditions: MultiClassCondition[],
    condition: MultiClassCondition | undefined,
    classes: Class[]
  ): Class[] {
    const selectedFields = this.getSelectedFields(conditions);
    const availableClasses = this.getClassesIntersectFields(selectedFields, classes);
    return condition
      ? availableClasses.filter((c) => c.attributes.find((a) => a.field.id === condition.field))
      : availableClasses;
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

  private getClassesIdsByConditions(conditions: MultiClassCondition[], classes: Class[]): string[] {
    const selectedFields = this.getSelectedFields(conditions);
    const availableClasses = this.getClassesIntersectFields(selectedFields, classes);
    return availableClasses.map((c) => c.id);
  }

  private getClassesIntersectFields(fields: string[], classes: Class[]): Class[] {
    return fields?.length > 0
      ? classes.filter((c) => {
          const fieldsInClass = c.attributes.map((a) => a.field.id);
          const intersect = fields.filter((field) => fieldsInClass.includes(field)).length;
          return intersect === fields.length;
        })
      : classes;
  }

  private getSelectedFields(conditions: MultiClassCondition[], excludedCondition?: string): string[] {
    return [
      ...new Set(conditions.filter((c) => !(c.id === excludedCondition || c.field === undefined)).map((c) => c.field))
    ];
  }
}
