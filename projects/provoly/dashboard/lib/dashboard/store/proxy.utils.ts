import { Store } from '@ngrx/store';
import { AttributeMultipleValue, AttributeSimpleValue, Item } from '../../core/model/item.interface';
import { ResultSet, ResultSets } from '../../core/model/result-set.interface';
import { SearchActions } from '../../core/store/search/search.actions';
import { SearchSelectors } from '../../core/store/search/search.selectors';
import { ClassSelectors } from '../../core/store/class/class.selectors';
import { Class } from '../../core/store/class/class.interface';

export class ProxyUtils {
  static store: Store;
  static currentlyLoading: string[];
  static requested = {} as { [rsId: string]: boolean };
  static classes: Class[];

  static init(store: Store) {
    this.store = store;
    store.select(SearchSelectors.searchLoading).subscribe((searchLoading) => {
      this.currentlyLoading = searchLoading;
    });
    store.select(ClassSelectors.classes).subscribe((classes) => {
      this.classes = classes;
    });
  }

  static ResultSets(rss: ResultSets) {
    return Object.entries(rss)
      .map(([key, value]) => ({ key, proxy: ProxyUtils.ResultSet(value, key) }))
      .reduce((p, c) => ({ ...p, [c.key]: c.proxy }), {});
  }

  static ResultSet(rs: ResultSet, rsId: string) {
    return {
      relations: rs.relations ?? [],
      autoRefreshInterval: rs.autoRefreshInterval,
      merged: rs.merged,
      count: rs.count,
      items: Object.keys(rs.items ?? {})
        .map((classId) => ({
          classId: classId,
          items: rs.items[classId].map((item) => ProxyUtils.Item(item, rsId))
        }))
        .reduce((p, c) => ({ ...p, [c.classId]: c.items }), {})
    };
  }

  private static Item(item: Item, rsId: string) {
    return {
      id: item.id,
      oClass: item.oClass,
      metadata: item.metadata,
      attributes: new Proxy<{
        [key: string]: AttributeSimpleValue | AttributeMultipleValue;
      }>(JSON.parse(JSON.stringify(item.attributes)), {
        get: (original, prop, proxy) => {
          if (prop === 'toJSON') {
            return () => original;
          } else {
            if (original[prop as string]) {
              return original[prop as string];
            } else {
              const clazz = this.classes.find((cl) => cl.id === item.oClass);
              const attr = clazz?.attributes.find((attr) => attr.technicalName === prop);
              if (!!attr) {
                if (!this.currentlyLoading.includes(rsId) && this.requested[prop as string] !== false) {
                  this.requested[prop as string] = false;
                  this.store.dispatch(
                    SearchActions.getDatasourceItems({ id: rsId, excludeGeo: false, from: 'ProxyUtils.Item()' })
                  );
                }
              } else {
                console.warn(
                  `Trying to access property ${prop as string} from class ${clazz?.name} but does not exist in model`
                );
              }
            }
          }
          return {
            type: 'VALUE',
            value: '',
            visible: false
          };
        }
      })
    } as Item;
  }
}
