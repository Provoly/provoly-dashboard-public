import { Store } from '@ngrx/store';
import { Class } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { BehaviorSubject } from 'rxjs';
import { GetValuePipe } from './get-value.pipe';

describe('GetValuePipe', () => {
  const pipe = new GetValuePipe({
    select: () =>
      new BehaviorSubject([
        { id: 'b', name: 'b-name', attributes: [{ id: 'a-id', name: 'a', technicalName: 'a', multiValued: false }] }
      ] as Class[])
  } as unknown as Store<any>);

  it('transforms values', () => {
    expect(
      pipe.transform({ id: 'a', oClass: 'b', attributes: { a: { value: 5, type: 'VALUE', visible: true } } }, 'id')
    ).toBeObservable(hot('a', { a: 'a' }));

    expect(
      pipe.transform({ id: 'a', oClass: 'b', attributes: { a: { value: 5, type: 'VALUE', visible: true } } }, 'a')
    ).toBeObservable(hot('a', { a: 5 }));
  });
});
