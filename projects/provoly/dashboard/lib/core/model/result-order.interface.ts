export type OrderValue = 'asc' | 'desc' | undefined;

export interface ResultOrder {
  attribute: string;
  asc: OrderValue;
}
