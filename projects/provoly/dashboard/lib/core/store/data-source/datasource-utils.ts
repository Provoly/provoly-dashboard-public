import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { NamedQueryTypes } from './named-query-types.model';
import { Dataset, DataSource, NamedQuery } from './data-source.model';
import { GeoMetadata } from '../../model/dataset.interface';

export const UNKNOWN_DATASOURCE = (id: string) =>
  ({
    id: id,
    color: '#FFFFFF',
    name: id,
    request: { fullSearch: { value: '???' }, type: NamedQueryTypes.FULL_TEXT },
    sourceType: 'namedQuery'
  }) as NamedQuery;

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

  static getAllDatasourcesWithUnknowns(
    allDatasources: DataSource[],
    widgetDatasources: string[] | string
  ): DataSource[] {
    let dss = [...allDatasources];
    const widgetDatasourcesArray = DatasourceUtils.getDatasourceArray(widgetDatasources);
    widgetDatasourcesArray.forEach((manifestDs) => {
      const alreadyPresent = !!allDatasources.find((ds) => ds.id === manifestDs);
      if (!alreadyPresent) {
        dss.push(UNKNOWN_DATASOURCE(manifestDs ?? ''));
      }
    });
    return dss;
  }

  static getDatasourceArray(datasource?: string | string[]): string[] {
    return datasource ? (Array.isArray(datasource) ? datasource : [datasource]) : [];
  }
}
