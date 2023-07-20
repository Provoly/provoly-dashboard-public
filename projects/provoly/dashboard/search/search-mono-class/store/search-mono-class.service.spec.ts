import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Class,
  Condition,
  Field,
  FieldType,
  MonoClassConditions,
  NamedQueryTypes,
  NormalizedCondition
} from '@provoly/dashboard';
import * as uuid from 'uuid';
import { SearchMonoClassService } from './search-mono-class.service';

jest.mock('uuid');
describe('SearchMonoClassService', () => {
  let service: SearchMonoClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({})]
    });
    service = TestBed.inject(SearchMonoClassService);
    jest.spyOn(uuid, 'v4').mockImplementation(() => 'id');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return composed condition', () => {
    expect(service.initNormalizedConditionComposed(null)).toEqual({
      id: 'id',
      parentId: null,
      type: 'AND'
    } as any as NormalizedCondition);
  });
  it('should return attribute condition', () => {
    expect(service.initNormalizedConditionAttribute('parent', 'attribute')).toEqual({
      id: 'id',
      parentId: 'parent',
      attribute: 'attribute',
      type: 'ATTRIBUTE',
      operator: 'EQUALS'
    } as NormalizedCondition);
  });
  it('should build monoclass payload', () => {
    const monoClassConditions: MonoClassConditions = {
      masterId: 'master',
      entities: {
        master: {
          id: 'master',
          parentId: 'master',
          type: 'AND',
          composed: ['child1', 'child2']
        },
        child1: {
          id: 'child1',
          parentId: 'master',
          type: 'AND',
          composed: ['leaf1', 'leaf2']
        },
        child2: {
          id: 'child2',
          parentId: 'master',
          type: 'OR',
          composed: ['leaf3']
        },
        leaf1: {
          id: 'leaf1',
          parentId: 'child1',
          type: 'ATTRIBUTE',
          attribute: 'attr1',
          operator: 'EQUALS',
          value: 'value'
        },
        leaf2: {
          id: 'leaf2',
          parentId: 'child1',
          type: 'ATTRIBUTE',
          attribute: 'attr2',
          operator: 'CONTAINS',
          value: 'value'
        },
        leaf3: {
          id: 'leaf3',
          parentId: 'child2',
          type: 'ATTRIBUTE',
          attribute: 'attr3',
          operator: 'CONTAINS',
          value: 'value'
        }
      },
      ids: ['master', 'child1', 'child2', 'leaf1', 'leaf2', 'leaf3']
    };
    const paylaod = service.buildMonoClassSearchPayloadForSearch('class', 'master', monoClassConditions, undefined);
    expect(paylaod).toEqual({
      oClass: 'class',
      type: NamedQueryTypes.MONO_CLASS,
      condition: {
        type: 'AND',
        composed: [
          {
            type: 'AND',
            composed: [
              {
                type: 'ATTRIBUTE',
                attribute: 'attr1',
                operator: 'EQUALS',
                value: 'value'
              },
              {
                type: 'ATTRIBUTE',
                attribute: 'attr2',
                operator: 'CONTAINS',
                value: 'value'
              }
            ]
          },
          {
            type: 'OR',
            composed: [
              {
                type: 'ATTRIBUTE',
                attribute: 'attr3',
                operator: 'CONTAINS',
                value: 'value'
              }
            ]
          }
        ]
      }
    });
  });
  it('should build mono class conditions from paylaod', () => {
    jest
      .spyOn(uuid, 'v4')
      .mockImplementationOnce(() => 'child1')
      .mockImplementationOnce(() => 'leaf1')
      .mockImplementationOnce(() => 'leaf2')
      .mockImplementationOnce(() => 'child2')
      .mockImplementationOnce(() => 'leaf3');
    const conditions: Condition = {
      type: 'AND',
      composed: [
        {
          type: 'AND',
          composed: [
            {
              type: 'ATTRIBUTE',
              attribute: 'attr1',
              operator: 'EQUALS',
              value: 'value'
            },
            {
              type: 'ATTRIBUTE',
              attribute: 'attr2',
              operator: 'CONTAINS',
              value: 'value'
            }
          ]
        },
        {
          type: 'OR',
          composed: [
            {
              type: 'ATTRIBUTE',
              attribute: 'attr3',
              operator: 'CONTAINS',
              value: 'value'
            }
          ]
        }
      ]
    };
    const classes = [
      {
        id: 'class',
        attributes: [
          {
            id: 'attr1',
            field: 'field1'
          },
          {
            id: 'attr2',
            field: 'field2'
          },
          {
            id: 'attr3',
            field: 'field3'
          }
        ]
      } as Class
    ];
    const fields: Field[] = [
      {
        id: 'field1',
        type: FieldType.DECIMAL,
        name: 'field1'
      },
      {
        id: 'field2',
        type: FieldType.INSTANT,
        name: 'field2'
      },
      {
        id: 'field3',
        type: FieldType.STRING,
        name: 'field3'
      }
    ];
    const monoConditions: { id: string; conditions: NormalizedCondition[] } = service.loadNormalizedConditions(
      conditions,
      'master',
      classes,
      fields,
      'master'
    );
    expect(monoConditions).toEqual({
      id: 'master',
      conditions: [
        {
          id: 'leaf1',
          parentId: 'child1',
          type: 'ATTRIBUTE',
          attribute: 'attr1',
          operator: 'EQUALS',
          pattern: '^[+-]?([0-9]*[.])?[0-9]+$',
          isDate: false,
          value: 'value'
        },
        {
          id: 'leaf2',
          parentId: 'child1',
          type: 'ATTRIBUTE',
          attribute: 'attr2',
          operator: 'CONTAINS',
          pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$|^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$',
          isDate: true,
          value: 'value'
        },
        {
          id: 'child1',
          parentId: 'master',
          type: 'AND',
          composed: ['leaf1', 'leaf2']
        },
        {
          id: 'leaf3',
          parentId: 'child2',
          type: 'ATTRIBUTE',
          attribute: 'attr3',
          operator: 'CONTAINS',
          pattern: '^.+$',
          isDate: false,
          value: 'value'
        },
        {
          id: 'child2',
          parentId: 'master',
          type: 'OR',
          composed: ['leaf3']
        },
        {
          id: 'master',
          parentId: 'master',
          type: 'AND',
          composed: ['child1', 'child2']
        }
      ]
    });
  });
});
