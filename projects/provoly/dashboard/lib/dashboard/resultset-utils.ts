import { Item } from '../core/model/item.interface';
import { Relation } from '../core/model/relation.interface';
import { ResultSet } from '../core/model/result-set.interface';

export class ResultsetUtils {
  static mergeResultSets(rs1: ResultSet, rs2: ResultSet): ResultSet {
    if (!rs1) return rs2;
    if (!rs2) return rs1;
    const rs1Copy = structuredClone(rs1);

    this.mergeItems(rs1Copy, rs2, (rs) => rs.items);
    this.mergeItems(rs1Copy, rs2, (rs) => rs.sourceItems ?? {});
    this.mergeItems(rs1Copy, rs2, (rs) => rs.destinationItems ?? {});

    /* Make items and relations unique in resulted dataset */
    rs1Copy.relations = [
      ...new Set([
        ...([...(rs1Copy.relations ?? []), ...(rs2.relations ?? [])] ?? []).map(
          (rel) => `${rel.relationType}|${rel.source}|${rel.destination}`
        ),
        ...(rs2.relations ?? []).map((rel) => `${rel.relationType}|${rel.source}|${rel.destination}`)
      ])
    ].map((key) => {
      const splittedKey = key.split('|');
      return { relationType: splittedKey[0], source: splittedKey[1], destination: splittedKey[2] };
    }) as Relation[];

    if (!rs1Copy.count) {
      rs1Copy.count = {};
    }
    Object.keys(rs2.count ?? {}).forEach((key) => {
      if (!rs1Copy.count![key]) {
        rs1Copy.count![key] = { count: 0, accurate: true };
      }
      rs1Copy.count![key] = {
        count: rs1Copy.count![key].count + rs2.count![key].count,
        accurate: rs1Copy.count![key].accurate && rs2.count![key].accurate
      };
    });

    rs1Copy.searchAfter = rs2.searchAfter ?? rs1Copy.searchAfter;

    return rs1Copy;
  }

  private static mergeItems(
    rs1: ResultSet,
    rs2: ResultSet,
    getItemsToMerge: (rs: ResultSet) => {
      [key: string]: Item[];
    }
  ): void {
    const rs1Items = getItemsToMerge(rs1);
    const rs2Items = getItemsToMerge(rs2);

    Object.keys(rs2Items).forEach((key) => {
      if (!rs1Items[key]) {
        rs1Items[key] = [];
      }
      rs1Items[key].push(...rs2Items[key]);
    });

    Object.keys(rs1Items).forEach((key) => {
      const uniqueList = [...new Set(rs1Items[key].map((it) => it.id))];
      rs1Items[key] = uniqueList.map((id) => (rs1Items ? rs1Items[key].find((it) => it.id === id) : [])) as Item[];
    });
  }
}
