import { Item, Relation } from '@provoly/dashboard';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

export interface PryNode extends SimulationNodeDatum {
  item: Item;
  id: string;
  image: HTMLCanvasElement | HTMLImageElement;
  selected: boolean;
  topologicalColor?: string;
}

export interface PryLink extends SimulationLinkDatum<PryNode> {
  relation: Relation;
}
