import { PryVisibility } from '../components/share/share.model';

export interface Widget {
  id: string;
  name: string;
  description: string;
  image: string;
  content: string;
  visibility?: PryVisibility;
  datasource: string[];
  owner?: boolean;
  cover?: boolean;
  modificationDate: string;
}
