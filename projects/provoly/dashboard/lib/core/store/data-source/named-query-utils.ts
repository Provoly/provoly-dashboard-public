import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { NamedQueryTypes } from './named-query-types.model';

export class NamedQueryUtils {
  static getTypeFromPayload(
    payload: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload | undefined
  ) {
    return payload === undefined
      ? undefined
      : payload.type === NamedQueryTypes.MONO_CLASS
      ? NamedQueryTypes.MONO_CLASS
      : payload.fullSearch === null
      ? NamedQueryTypes.MULTI_CLASS
      : NamedQueryTypes.FULL_TEXT;
  }
}
