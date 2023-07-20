import { Item } from './item.interface';
import { Relation } from './relation.interface';

export type ResultSets = { [key: string]: ResultSet };

export interface ResultSet {
  items: { [classId: string]: Item[] };
  relations: Relation[];
  autoRefreshInterval?: number;
  merged?: number;
  count?: { [classId: string]: { count: number; accurate: boolean } };
}
