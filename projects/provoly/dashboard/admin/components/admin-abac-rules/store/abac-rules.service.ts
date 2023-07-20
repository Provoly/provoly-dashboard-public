import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AbacRule, AbacRulesConditions, Condition, NormalizedCondition, OperatorType } from './abac-rules.model';

@Injectable({
  providedIn: 'root'
})
export class AbacRulesService {
  initializeNewAbacRule(): AbacRule {
    return {
      id: uuidv4(),
      name: '',
      type: 'METADATA',
      description: '',
      active: true
    } as AbacRule;
  }

  initializeCondition(parentId: string | null = null, conditionId: string | null = null): NormalizedCondition {
    const id = uuidv4();
    return {
      id: conditionId ?? id,
      parentId: parentId ?? id,
      type: 'AND'
    } as NormalizedCondition;
  }

  getMetadataCondition(
    metadata: string,
    parentId: string,
    operator: OperatorType = 'EQUALS',
    value: any = ''
  ): NormalizedCondition {
    const id = uuidv4();
    return {
      id,
      metadata,
      parentId,
      operator: operator,
      type: 'METADATA',
      value: value
    } as NormalizedCondition;
  }

  getAttributeCondition(
    attribute: string,
    classId: string,
    parentId: string,
    operator: OperatorType = 'EQUALS',
    value: any = ''
  ): NormalizedCondition {
    const id = uuidv4();
    return {
      id,
      attribute,
      parentId,
      class: classId,
      operator: operator,
      type: 'ATTRIBUTE',
      value: value
    } as NormalizedCondition;
  }

  buildPayloadForAbacRule(rule: AbacRule, conditions: AbacRulesConditions): AbacRule {
    const condition = this.buildConditionsForAbacRule(conditions);
    return condition ? { ...rule, condition } : { ...rule };
  }

  buildConditionsForAbacRule(conditions: AbacRulesConditions): Condition | null {
    if (!conditions.masterId) {
      return null;
    }
    return this.mapNormalizedConditionToCondition(conditions.entities[conditions.masterId], conditions);
  }

  mapNormalizedConditionToCondition(cond: NormalizedCondition, tree: AbacRulesConditions): Condition {
    return {
      type: cond.type,
      attribute: cond.attribute,
      composed: cond.composed?.map((id) => this.mapNormalizedConditionToCondition(tree.entities[id], tree)),
      metadata: cond.metadata,
      operator: cond.operator,
      value: cond.value
    };
  }

  mapAbacRuleToEditAbacRule(rule: AbacRule): { rule: AbacRule; conditions: AbacRulesConditions } {
    const editRule: AbacRule = {
      id: rule.id,
      active: rule.active,
      description: rule.description,
      name: rule.name,
      predicate: rule.predicate,
      type: rule.type
    };
    const masterId = uuidv4();
    const conditions = rule.condition
      ? this.createNormalizedConditions(rule.condition, masterId, masterId).conditions
      : [this.initializeCondition(masterId, masterId)];
    const editRuleCondtitions: AbacRulesConditions = {
      masterId,
      ids: conditions.map((cond) => cond.id),
      entities: conditions.reduce((acc, cond) => ({ ...acc, [cond.id]: cond }), {})
    };
    return {
      rule: editRule,
      conditions: editRuleCondtitions
    };
  }

  createNormalizedConditions(
    cond: Condition,
    parentId: string,
    masterId: string | null = null
  ): { id: string; conditions: NormalizedCondition[] } {
    if (cond.type === 'AND' || cond.type === 'OR') {
      const id = masterId ?? uuidv4();
      if (cond.composed) {
        const children = cond.composed.map((cond) => this.createNormalizedConditions(cond, id));
        const ids = children.map((child) => child.id);
        const normalizedChildren = children.reduce(
          (acc, res) => [...acc, ...res.conditions],
          [] as NormalizedCondition[]
        );
        return {
          id,
          conditions: [
            {
              id,
              parentId: parentId,
              type: cond.type,
              composed: ids
            },
            ...normalizedChildren
          ]
        };
      }
      return {
        id,
        conditions: [
          {
            id,
            parentId: parentId,
            type: cond.type
          }
        ]
      };
    } else if (cond.type === 'ATTRIBUTE') {
      const id = masterId ?? uuidv4();
      return {
        id,
        conditions: [
          {
            id,
            parentId,
            type: 'ATTRIBUTE',
            attribute: cond.attribute,
            operator: cond.operator,
            value: cond.value
          }
        ]
      };
    } else {
      const id = masterId ?? uuidv4();
      return {
        id,
        conditions: [
          {
            id: id,
            parentId,
            type: 'METADATA',
            metadata: cond.metadata,
            operator: cond.operator,
            value: cond.value
          }
        ]
      };
    }
  }
}
