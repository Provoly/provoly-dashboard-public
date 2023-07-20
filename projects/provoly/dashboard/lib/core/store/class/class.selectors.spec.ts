import { Attribute, Class } from './class.interface';
import * as fromClass from './class.reducer';
import { initialClassState } from './class.reducer';
import { ClassSelectors } from './class.selectors';

describe('Class Selectors', () => {
  const attr1: Attribute = {
    id: 'attr1',
    name: 'attr1',
    field: 'field1',
    multiValued: false
  };

  const class1: Class = {
    id: 'class1',
    name: 'class1',
    attributes: [attr1]
  };

  it('should select the feature state', () => {});
  const initialState = Object.assign({}, initialClassState);
  it('should select the feature state', () => {
    const result = ClassSelectors.feature({
      [fromClass.classesFeatureKey]: {}
    });

    expect(result).toEqual({} as fromClass.ClassState);
  });

  describe('attributesByFieldId', () => {
    it('should return empty array', () => {
      const classes: Class[] = [
        class1,
        {
          ...class1,
          id: 'class2',
          attributes: [{ ...attr1, id: 'attr2', name: 'attr2', field: 'field2' }]
        }
      ];
      const result = ClassSelectors.attributesByFieldId('field3').projector(classes);

      expect(result).toEqual([]);
    });
    it('should return array with one element', () => {
      const classes: Class[] = [
        class1,
        {
          ...class1,
          id: 'class2',
          attributes: [{ ...attr1, id: 'attr2', name: 'attr2', field: 'field2' }]
        }
      ];
      const result = ClassSelectors.attributesByFieldId('field2').projector(classes);

      expect(result.length).toEqual(1);
      expect(result).toEqual([{ id: 'attr2', field: 'field2', multiValued: false, name: 'attr2' }]);
    });
    it('should return array with two element', () => {
      const classes: Class[] = [
        class1,
        {
          ...class1,
          id: 'class2',
          attributes: [{ ...attr1, id: 'attr2', name: 'attr2' }]
        }
      ];
      const result = ClassSelectors.attributesByFieldId('field1').projector(classes);

      expect(result.length).toEqual(2);
      expect(result).toEqual([
        { id: 'attr1', field: 'field1', multiValued: false, name: 'attr1' },
        { id: 'attr2', field: 'field1', multiValued: false, name: 'attr2' }
      ]);
    });
  });
});
