export interface Widget {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  groups?: string[];
  datasource: string[];
  owner?: boolean;
  modificationDate: string;
}
