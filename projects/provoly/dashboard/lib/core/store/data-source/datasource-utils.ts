import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { NamedQueryTypes } from './named-query-types.model';
import { Dataset, NamedQuery } from './data-source.model';
import { GeoMetadata } from '../../model/dataset.interface';

export class DatasourceUtils {
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

  static isGeo(ds: NamedQuery | Dataset) {
    return (
      !!ds &&
      !!ds.metadata &&
      ds.metadata?.find((m) => m.metadataDef.name === GeoMetadata.KEY) !== undefined &&
      ds.metadata?.find((m) => m.metadataDef.name === GeoMetadata.NAMESPACE) !== undefined
    );
  }
}
