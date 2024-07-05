import * as fromClass from './class.reducer';
import { initialClassState } from './class.reducer';
import { ClassSelectors } from './class.selectors';
import { mockClasses, mockFields } from '@provoly/dashboard/mock/data/mockModel';

describe('Class Selectors', () => {
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
      const result = ClassSelectors.attributesByFieldId('field3').projector(mockClasses);

      expect(result).toEqual([]);
    });
    it('should return array with one element', () => {
      const result = ClassSelectors.attributesByFieldId('field2').projector(mockClasses);

      expect(result.length).toEqual(1);
      expect(result).toEqual([
        { id: 'attr3', field: mockFields[1], multiValued: false, name: 'attr3', technicalName: 'attr3' }
      ]);
    });
    it('should return array with two element', () => {
      const result = ClassSelectors.attributesByFieldId('field1').projector(mockClasses);

      expect(result.length).toEqual(2);
      expect(result).toEqual([
        { id: 'attr1', field: mockFields[0], multiValued: false, name: 'attr1', technicalName: 'attr1' },
        { id: 'attr2', field: mockFields[0], multiValued: false, name: 'attr2', technicalName: 'attr2' }
      ]);
    });
  });
});
