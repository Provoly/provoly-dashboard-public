import { TestBed } from '@angular/core/testing';
import * as uuid from 'uuid';
import { AbacRule, AbacRulesConditions, Condition, NormalizedCondition } from './abac-rules.model';
import { AbacRulesService } from './abac-rules.service';

jest.mock('uuid');
describe('AbacRulesService', () => {
  let service: AbacRulesService;

  const abacRule: AbacRule = {
    id: 'c4fbdebc-f82a-4ecc-b2a5-c56782784305',
    active: false,
    description: '',
    name: 'Nom de la règle meta avec changements',
    predicate: '3',
    type: 'METADATA',
    condition: {
      type: 'AND',
      composed: [
        {
          type: 'METADATA',
          metadata: '7d64f61e-03fe-43bb-a08f-c93428302759',
          operator: 'LOWER_THAN',
          value: 'le 14'
        },
        {
          type: 'AND',
          composed: [
            {
              type: 'METADATA',
              metadata: 'ba681f33-fe70-42f8-a277-05c607ba29cf',
              operator: 'EQUALS',
              value: 'vigi'
            },
            {
              type: 'METADATA',
              metadata: 'e1e55abd-2fb7-4e3b-9372-92c7c9d6c5c4',
              operator: 'INNER_BOUNDS',
              value: '14'
            }
          ]
        },
        {
          type: 'AND',
          composed: [
            {
              type: 'METADATA',
              metadata: '7d64f61e-03fe-43bb-a08f-c93428302759',
              operator: 'EQUALS',
              value: '15'
            },
            {
              type: 'METADATA',
              metadata: '2b7b8c04-edc9-4975-b089-ad97781c3eaf',
              operator: 'GREATER_THAN',
              value: '18'
            }
          ]
        }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbacRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeNewAbacRule', () => {
    it('should return new abac rule', () => {
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => 'id');
      const result = service.initializeNewAbacRule();
      expect(result).toEqual({
        id: 'id',
        name: '',
        type: 'METADATA',
        description: '',
        active: true
      } as AbacRule);
    });
  });

  describe('initializeCondition', () => {
    it('should return new condition without params', () => {
      const id = 'id';
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => id);
      const result = service.initializeCondition();
      expect(result).toEqual({
        id: id,
        parentId: id,
        type: 'AND'
      } as NormalizedCondition);
    });
    it('should return new condition with params', () => {
      const parentId = 'parentId';
      const conditionId = 'conditionId';
      const result = service.initializeCondition(parentId, conditionId);
      expect(result).toEqual({
        id: conditionId,
        parentId: parentId,
        type: 'AND'
      } as NormalizedCondition);
    });
  });

  describe('getMetadataCondition', () => {
    it('should return new condition without params', () => {
      const id = 'id';
      const metadata = 'metadata';
      const parentId = 'parentId';
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => id);
      const result = service.getMetadataCondition(metadata, parentId);
      expect(result).toEqual({
        id,
        metadata,
        parentId,
        operator: 'EQUALS',
        type: 'METADATA',
        value: ''
      } as NormalizedCondition);
    });
    it('should return new condition with params', () => {
      const id = 'id';
      const metadata = 'metadata';
      const parentId = 'parentId';
      const operator = 'CONTAINS';
      const value = 'value';
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => id);
      const result = service.getMetadataCondition(metadata, parentId, operator, value);
      expect(result).toEqual({
        id,
        metadata,
        parentId,
        operator,
        type: 'METADATA',
        value
      } as NormalizedCondition);
    });
  });

  describe('getAttributeCondition', () => {
    it('should return new condition without params', () => {
      const id = 'id';
      const classId = 'classId';
      const attribute = 'attribute';
      const parentId = 'parentId';
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => id);
      const result = service.getAttributeCondition(attribute, classId, parentId);
      expect(result).toEqual({
        id,
        class: classId,
        attribute,
        parentId,
        operator: 'EQUALS',
        type: 'ATTRIBUTE',
        value: ''
      } as NormalizedCondition);
    });
    it('should return new condition with params', () => {
      const id = 'id';
      const classId = 'classId';
      const attribute = 'attribute';
      const parentId = 'parentId';
      const operator = 'CONTAINS';
      const value = 'value';
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => id);
      const result = service.getAttributeCondition(attribute, classId, parentId, operator, value);
      expect(result).toEqual({
        id,
        class: classId,
        attribute,
        parentId,
        operator,
        type: 'ATTRIBUTE',
        value
      } as NormalizedCondition);
    });
  });

  describe('buildPayloadForAbacRule', () => {
    it('should return abac rule without conditions', () => {
      const rule = {
        id: 'id',
        name: 'name'
      } as AbacRule;
      jest.spyOn(service, 'buildConditionsForAbacRule').mockImplementationOnce(() => null);
      const result = service.buildPayloadForAbacRule(rule, {} as AbacRulesConditions);
      expect(result).toEqual(rule);
    });
    it('should return abac rule with conditions', () => {
      const rule = {
        id: 'id',
        name: 'name'
      } as AbacRule;
      const condition = {
        type: 'ATTRIBUTE',
        attribute: 'attribute'
      } as Condition;
      jest.spyOn(service, 'buildConditionsForAbacRule').mockImplementationOnce(() => condition);
      const result = service.buildPayloadForAbacRule(rule, {} as AbacRulesConditions);
      expect(result).toEqual({ ...rule, condition });
    });
  });

  describe('buildConditionsForAbacRule', () => {
    it('should return null', () => {
      const abacRulesConditions = {
        masterId: null,
        entities: {},
        ids: []
      } as AbacRulesConditions;
      const result = service.buildConditionsForAbacRule(abacRulesConditions);
      expect(result).toEqual(null);
    });
    it('should return conditions', () => {
      const abacRulesConditions = {
        masterId: 'id',
        entities: {},
        ids: []
      } as AbacRulesConditions;
      const condition = {
        type: 'ATTRIBUTE',
        attribute: 'attribute'
      } as Condition;
      jest.spyOn(service, 'mapNormalizedConditionToCondition').mockImplementationOnce(() => condition);
      const result = service.buildConditionsForAbacRule(abacRulesConditions);
      expect(result).toEqual(condition);
    });
  });

  describe('mapNormalizedConditionToCondition', () => {
    it('should return condition leaf without children', () => {
      const normalizedCondition = {
        id: 'id',
        type: 'ATTRIBUTE',
        attribute: 'attribute',
        value: 'value',
        operator: 'EQUALS'
      } as NormalizedCondition;
      const abacRulesConditions = {
        masterId: 'id',
        entities: { id: normalizedCondition },
        ids: ['id']
      } as AbacRulesConditions;
      const result = service.mapNormalizedConditionToCondition(normalizedCondition, abacRulesConditions);
      expect(result).toEqual({
        type: 'ATTRIBUTE',
        attribute: 'attribute',
        composed: undefined,
        metadata: undefined,
        operator: 'EQUALS',
        value: 'value'
      });
    });
    it('should return condition with one child', () => {
      const normalizedCondition = {
        id: 'id',
        type: 'ATTRIBUTE',
        attribute: 'attribute',
        value: 'value',
        operator: 'EQUALS',
        composed: ['id2']
      } as NormalizedCondition;
      const abacRulesConditions = {
        masterId: 'id',
        entities: { id: normalizedCondition, id2: { ...normalizedCondition, composed: [] } },
        ids: ['id', 'id2']
      } as AbacRulesConditions;
      const result = service.mapNormalizedConditionToCondition(normalizedCondition, abacRulesConditions);
      expect(result).toEqual({
        type: 'ATTRIBUTE',
        attribute: 'attribute',
        composed: [
          {
            type: 'ATTRIBUTE',
            attribute: 'attribute',
            composed: [],
            metadata: undefined,
            operator: 'EQUALS',
            value: 'value'
          }
        ],
        metadata: undefined,
        operator: 'EQUALS',
        value: 'value'
      });
    });
  });

  describe('mapAbacRuleToEditAbacRule', () => {
    it('should return abac rule with new init condition', () => {
      const normalizedCondition = {
        id: 'id',
        type: 'ATTRIBUTE',
        attribute: 'attribute',
        value: 'value',
        operator: 'EQUALS'
      } as NormalizedCondition;
      const id = 'id';
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => id);
      jest.spyOn(service, 'initializeCondition').mockImplementationOnce(() => normalizedCondition);
      const result = service.mapAbacRuleToEditAbacRule({ ...abacRule, condition: undefined });
      expect(result).toEqual({
        rule: { ...abacRule, condition: undefined },
        conditions: {
          masterId: id,
          entities: { id: normalizedCondition },
          ids: ['id']
        }
      });
    });
    it('should return abac rule with conditions', () => {
      const normalizedCondition = {
        id: 'id',
        type: 'ATTRIBUTE',
        attribute: 'attribute',
        value: 'value',
        operator: 'EQUALS'
      } as NormalizedCondition;
      const id = 'id';
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => id);
      jest
        .spyOn(service, 'createNormalizedConditions')
        .mockImplementationOnce(() => ({ id: 'id', conditions: [normalizedCondition] }));
      const result = service.mapAbacRuleToEditAbacRule(abacRule);
      expect(result).toEqual({
        rule: { ...abacRule, condition: undefined },
        conditions: {
          masterId: id,
          entities: { id: normalizedCondition },
          ids: ['id']
        }
      });
    });
  });
});
