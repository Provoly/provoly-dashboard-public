import { Store } from '@ngrx/store';
import { Class, Field, FieldSelectors } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { BehaviorSubject, of } from 'rxjs';
import { mapUtilsData } from '../utils/widget-map.utils.spec';
import { GeometryFieldsForPipe } from './widget-map-geometry-fields-for.pipe';

describe('WidgetMapGeometryFieldsForPipe', () => {
  const pipe = new GeometryFieldsForPipe({
    select: (selector: any) => {
      if (selector === FieldSelectors.fields) {
        return new BehaviorSubject([...mapUtilsData.fields, { id: 'lat-string', type: 'string' }] as Field[]);
      } else {
        return new BehaviorSubject([...mapUtilsData.classes] as Class[]);
      }
    }
  } as unknown as Store<any>);

  it('transforms values', () => {
    expect(
      pipe.transform({ type: 'bubble', attribute: '' }, { resultSet: of({ items: { aaa: [] }, relations: [] }) })
    ).toBeObservable(
      hot('a', {
        a: [{ field: 'loc-xxxx', id: 'loc', name: 'loc' }]
      })
    );
  });
});
