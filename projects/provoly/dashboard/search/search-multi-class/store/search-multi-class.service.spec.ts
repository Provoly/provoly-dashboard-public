import { TestBed } from '@angular/core/testing';
import {
  Attribute,
  Class,
  Field,
  FieldType,
  MultiClassCondition,
  MultiClassSearchPayload,
  NamedQueryTypes
} from '@provoly/dashboard';
import * as uuid from 'uuid';
import { SearchMultiClassService } from './search-multi-class.service';

const conditions: MultiClassCondition[] = [
  {
    id: 'id1',
    field: 'field1',
    isDate: true,
    operator: 'GREATER_THAN',
    value: 'value'
  },
  {
    id: 'id2',
    field: 'field2',
    isDate: false,
    operator: 'EQUALS',
    value: 'value'
  }
];

const classes: Class[] = [
  {
    id: 'class1',
    name: 'class1',
    attributes: [
      {
        field: 'field1',
        id: 'id'
      } as Attribute,
      {
        field: 'field2',
        id: 'id2'
      } as Attribute,
      {
        field: 'field3',
        id: 'id3'
      } as Attribute
    ]
  } as Class,
  {
    id: 'class2',
    name: 'class2',
    attributes: [
      {
        field: 'field1',
        id: 'id'
      } as Attribute,
      {
        field: 'field2',
        id: 'id2'
      } as Attribute
    ]
  } as Class,
  {
    id: 'class3',
    name: 'class3',
    attributes: [
      {
        field: 'field2',
        id: 'id4'
      } as Attribute,
      {
        field: 'field4',
        id: 'id4'
      } as Attribute
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
    name: 'field3'
  } as Field,
  {
    id: 'field4',
    name: 'field4'
  } as Field
];

jest.mock('uuid');
describe('SearchMultiClassService', () => {
  let service: SearchMultiClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchMultiClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateCondition', () => {
    it('should generate condition without field, operator and value', () => {
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => 'id');
      const cond = service.generateCondition();

      expect(cond).toEqual({
        id: 'id',
        field: undefined,
        isDate: false,
        operator: null,
        value: null
      } as any);
    });
    it('should generate condition with field', () => {
      jest.spyOn(uuid, 'v4').mockImplementationOnce(() => 'id');
      const cond = service.generateCondition('field');
      expect(cond).toEqual({
        id: 'id',
        field: 'field',
        operator: 'EQUALS',
        value: '',
        isDate: false
      } as MultiClassCondition);
    });
  });

  describe('getPatternForField', () => {
    it('should return correct patterns', () => {
      const decimalPattern = service.getPatternForField({ type: FieldType.DECIMAL } as Field);
      expect(decimalPattern).toEqual('^[+-]?([0-9]*[.])?[0-9]+$');
      const integerPattern = service.getPatternForField({ type: FieldType.INTEGER } as Field);
      expect(integerPattern).toEqual('^[+-]?[0-9]+$');
      const stringPattern = service.getPatternForField({ type: FieldType.STRING } as Field);
      expect(stringPattern).toEqual('^.+$');
      const instantPattern = service.getPatternForField({ type: FieldType.INSTANT } as Field);
      expect(instantPattern).toEqual(
        '^[0-9]{4}-[0-9]{2}-[0-9]{2}$|^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$'
      );
      const defaultPattern = service.getPatternForField({ type: 'other' } as any);
      expect(defaultPattern).toEqual('^.+$');
    });
  });

  describe('getConditionsFromSearchPayload', () => {
    it('should return generatedCondition', () => {
      const spyGenerateCondition = jest.spyOn(service, 'generateCondition').mockReturnValue(conditions[0]);
      const spyGetPatternForField = jest.spyOn(service, 'getPatternForField').mockReturnValue('pattern');
      const payload = {
        fields: [
          {
            field: 'field',
            value: '',
            operator: 'EQUALS'
          }
        ]
      } as MultiClassSearchPayload;
      const conditionsComputed = service.getConditionsFromSearchPayload(payload, fields);
      expect(spyGenerateCondition).toHaveBeenCalled();
      expect(spyGetPatternForField).not.toHaveBeenCalled();
      expect(conditionsComputed).toEqual([conditions[0]]);
    });

    it('should return condition of type instant', () => {
      const spyGenerateCondition = jest.spyOn(service, 'generateCondition').mockReturnValue(conditions[0]);
      const spyGetPatternForField = jest.spyOn(service, 'getPatternForField').mockReturnValue('pattern');
      const payload = {
        fields: [
          {
            field: 'field2',
            value: 'value',
            operator: 'EQUALS'
          }
        ]
      } as MultiClassSearchPayload;
      const conditionsComputed = service.getConditionsFromSearchPayload(payload, fields);
      expect(spyGenerateCondition).toHaveBeenCalled();
      expect(spyGetPatternForField).toHaveBeenCalled();
      expect(conditionsComputed).toEqual([
        {
          ...conditions[0],
          value: 'value',
          pattern: 'pattern',
          isDate: true
        }
      ]);
    });
    it('should return condition of type decimal', () => {
      const spyGenerateCondition = jest.spyOn(service, 'generateCondition').mockReturnValue(conditions[0]);
      const spyGetPatternForField = jest.spyOn(service, 'getPatternForField').mockReturnValue('pattern');
      const payload = {
        fields: [
          {
            field: 'field1',
            value: 'value',
            operator: 'EQUALS'
          }
        ]
      } as MultiClassSearchPayload;
      const conditionsComputed = service.getConditionsFromSearchPayload(payload, fields);
      expect(spyGenerateCondition).toHaveBeenCalled();
      expect(spyGetPatternForField).toHaveBeenCalled();
      expect(conditionsComputed).toEqual([
        {
          ...conditions[0],
          value: 'value',
          pattern: 'pattern',
          isDate: false
        }
      ]);
    });
  });

  describe('buildConditionsToSearchPayload', () => {
    it('should create payload', () => {
      const payload = service.buildConditionsToSearchPayload(conditions, classes, 'AND');
      expect(payload).toEqual({
        type: NamedQueryTypes.MULTI_CLASS,
        fullSearch: null,
        multiType: 'AND',
        oClasses: ['class1', 'class2'],
        fields: [
          { field: 'field1', operator: 'GREATER_THAN', value: 'value' },
          { field: 'field2', operator: 'EQUALS', value: 'value' }
        ]
      });
    });
  });

  describe('getFieldsAvailable', () => {
    it('should return fields with classes with no conditions', () => {
      const fieldsWithClasses = service.getFieldsAvailable([], classes, fields);
      expect(fieldsWithClasses).toEqual([
        { id: 'field1', name: 'field1', classes: ['class1', 'class2'] },
        { id: 'field2', name: 'field2', classes: ['class1', 'class2', 'class3'] },
        { id: 'field3', name: 'field3', classes: ['class1'] },
        { id: 'field4', name: 'field4', classes: ['class3'] }
      ]);
    });
    it('should return fields with classes with one condition', () => {
      const fieldsWithClasses = service.getFieldsAvailable([conditions[0]], classes, fields);
      expect(fieldsWithClasses).toEqual([
        { id: 'field1', name: 'field1', classes: ['class1', 'class2'] },
        { id: 'field2', name: 'field2', classes: ['class1', 'class2'] },
        { id: 'field3', name: 'field3', classes: ['class1'] }
      ]);
    });
    it('should return fields with classes with one condition that is excluded', () => {
      const fieldsWithClasses = service.getFieldsAvailable([conditions[0]], classes, fields, 'id1');
      expect(fieldsWithClasses).toEqual([
        { id: 'field1', name: 'field1', classes: ['class1', 'class2'] },
        { id: 'field2', name: 'field2', classes: ['class1', 'class2', 'class3'] },
        { id: 'field3', name: 'field3', classes: ['class1'] },
        { id: 'field4', name: 'field4', classes: ['class3'] }
      ]);
    });
    it('should return fields with classes with many conditions', () => {
      const fieldsWithClasses = service.getFieldsAvailable(conditions, classes, fields);
      expect(fieldsWithClasses).toEqual([
        { id: 'field1', name: 'field1', classes: ['class1', 'class2'] },
        { id: 'field2', name: 'field2', classes: ['class1', 'class2'] },
        { id: 'field3', name: 'field3', classes: ['class1'] }
      ]);
    });
  });
  describe('getClassesForField', () => {
    it('should return all classes', () => {
      const classesForField = service.getClassesForField([], undefined, classes);
      expect(classesForField).toEqual(classes);
    });
    it('should return classes', () => {
      const classesForField = service.getClassesForField([conditions[0]], conditions[0], classes);
      expect(classesForField).toEqual([classes[0], classes[1]]);
    });
  });
});
