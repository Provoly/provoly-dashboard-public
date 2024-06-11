import { Store } from '@ngrx/store';
import { hot } from 'jest-marbles';
import { of } from 'rxjs';
import { PryI18nService } from '../../i18n/i18n.service';
import { ClassSelectors } from '../../store/class/class.selectors';
import { ConfigSelectors } from '../../store/config/config.selectors';
import { FieldSelectors } from '../../store/field/field.selectors';
import { SymbolService } from '../../symbol/symbol.service';
import { TranslateIdPipe } from './translate-id.pipe';

const fields = [
  { id: 'f1', name: 'field-name-1', type: 'string' },
  { id: 'f2', name: 'field-name-2', type: 'string' },
  { id: 'f3', name: 'field-name-3', type: 'integer' },
  { id: 'f4', name: 'field-name-4', type: 'instant' }
];

const classes = [
  { id: 'a', attributes: [{ id: '1', field: 'f1', name: 'field-name-1' }] },
  { id: 'b', attributes: [{ id: '2', field: 'f2', name: 'field-name-2' }], name: 'classB' },
  { id: 'c', attributes: [{ id: '3', field: 'f2', name: 'field-name-3' }], name: 'classC' },
  { id: 'd', attributes: [{ id: '4', field: 'f2', name: 'field-name-4' }], name: 'classD' }
];

const iconDefinitions = {
  e: [{ iconUrl: 'http://e', iconSize: [25, 25] }],
  f: [{ iconUrl: 'http://f', iconSize: [25, 25] }]
};

describe('TranslateIdPipe', () => {
  it('create an instance', () => {
    const pipe = new TranslateIdPipe(
      { dispatch: () => undefined } as unknown as Store,
      { instant: (x: string) => x } as PryI18nService,
      { domSanitizer: () => undefined } as unknown as SymbolService
    );
    expect(pipe).toBeTruthy();
  });

  let pipe: TranslateIdPipe;

  beforeEach(() => {
    pipe = new TranslateIdPipe(
      {
        dispatch: () => undefined,
        select: (arg: any) => {
          if (arg === FieldSelectors.fields) {
            return of(fields);
          }
          if (arg === ClassSelectors.classes) {
            return of(classes);
          }
          if (arg === ConfigSelectors.iconDefinitions) {
            return of(iconDefinitions);
          }
          return of([]);
        }
      } as unknown as Store,
      { instant: (x: string) => x } as PryI18nService,
      { getSymbolOfClass: () => of('xxxx') } as unknown as SymbolService
    );
  });

  describe('should transform correctly', () => {
    it('field id into field name', () => {
      const expected = hot('(a|)', {
        a: fields[3].name
      });
      expect(pipe.transform('f4', { type: 'field' })).toBeObservable(expected);
    });
    it('class id into icon when defined in config', () => {
      const expected = hot('(a|)', {
        a: 'xxxx'
      });
      expect(pipe.transform('f', { type: 'class', output: 'icon' })).toBeObservable(expected);
    });
    it('class id into icon when not defined', () => {
      const expected = hot('(a|)', {
        a: 'xxxx'
      });
      expect(pipe.transform('x', { type: 'class', output: 'icon' })).toBeObservable(expected);
    });
    it('class id into name', () => {
      const expected = hot('(a|)', {
        a: 'classC'
      });
      expect(pipe.transform('c', { type: 'class', output: 'name' })).toBeObservable(expected);
    });
  });
});
