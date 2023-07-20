import { LGraph, LGraphNode, LiteGraph } from 'litegraph.js';
import { PrySerializedNode, PrySerializedPipeline } from './pipeline.interface';

export class GraphSerializerUtils {
  static serialize(lgraph: LGraph, id?: string): PrySerializedPipeline {
    const output = {
      id: id,
      links: [],
      nodes: []
    } as PrySerializedPipeline;

    if (!!lgraph) {
      const baseLiteGraph = JSON.parse(JSON.stringify(lgraph.serialize()));
      const translated = GraphSerializerUtils.translateFromSerializedLGraphToPryModel(baseLiteGraph);
      output.nodes = translated.nodes;
      output.links = translated.links;
    }
    return output;
  }

  static translateFromSerializedLGraphToPryModel(graph: any): PrySerializedPipeline {
    return {
      nodes: graph.nodes.map((node: any) => {
        const output = {
          id: node.properties['id'],
          type: node.type,
          title: node.title ?? node.type,
          spec: {
            ...node.properties
          },
          gui: {
            pos: [node.pos[0], node.pos[1]],
            size: [node.size[0], node.size[1]]
          }
        } as PrySerializedNode;

        delete output.spec['subgraph'];
        delete output.spec['id'];
        delete output.spec['type'];
        delete output.spec['_label'];

        if (node.type === 'SubGraphNode') {
          output.subgraph = GraphSerializerUtils.translateFromSerializedLGraphToPryModel(node.properties['subgraph']);
        }

        return output;
      }),
      links: graph.links.map((linkArray: any[]) => ({
        start: {
          id: graph.nodes.find((node: LGraphNode) => node.id === linkArray[1]).properties['id'],
          slot: linkArray[2]
        },
        end: {
          id: graph.nodes.find((node: LGraphNode) => node.id === linkArray[3]).properties['id'],
          slot: linkArray[4]
        }
      }))
    };
  }

  static hydrate(serializedGraph: PrySerializedPipeline, lgraph: LGraph) {
    const hydratedNodes = serializedGraph.nodes
      .map((node) => GraphSerializerUtils.createNode(node))
      .filter((node) => !!node);
    hydratedNodes.forEach((node) => lgraph.add(node));

    serializedGraph.links.forEach((link) => {
      const startNode = hydratedNodes.find((hNode) => link.start.id === hNode.properties['id']);
      const endNode = hydratedNodes.find((hNode) => link.end.id === hNode.properties['id']);
      if (startNode && endNode) {
        startNode.connect(link.start.slot, endNode, link.end.slot);
      } else {
        if (!startNode) {
          console.error(`Missing node id ${link.start.id} for link hydratation`);
        }
        if (!endNode) {
          console.error(`Missing node id ${link.end.id} for link hydratation`);
        }
      }
    });
  }

  static createNode(serializedNode: PrySerializedNode): LGraphNode {
    const node_const = LiteGraph.createNode(serializedNode.type, serializedNode.title, {});
    if (!node_const) {
      console.error(`Node with type ${serializedNode.type} could not have been created (id ${serializedNode.id}).`);
    } else {
      node_const.title = serializedNode.title;
      for (let i = 0; i < 2; i++) {
        node_const.pos[i] = serializedNode.gui.pos[i];
        node_const.size[i] = serializedNode.gui.size[i];
      }
      Object.keys(serializedNode.spec).forEach((key) => (node_const.properties[key] = serializedNode.spec[key]));
      node_const.properties['id'] = serializedNode.id;

      if (serializedNode.type === 'SubGraphNode') {
        const subGraphNode = node_const as any; // type is SubGRaphNode, but we don't want to introduce a dependency to optional module Subgraph

        for (let i = 0; i < subGraphNode.properties['inputs']; i++) {
          subGraphNode.createInput(
            serializedNode.subgraph!.nodes.filter((node) => node.type === 'SubGraphInput')[i].id
          );
        }
        for (let i = 0; i < subGraphNode.properties['outputs']; i++) {
          subGraphNode.createOutput(
            serializedNode.subgraph!.nodes.filter((node) => node.type === 'SubGraphOutput')[i].id
          );
        }

        GraphSerializerUtils.hydrate({ ...serializedNode.subgraph! }, subGraphNode.subGraph);
      }
    }
    return node_const;
  }
}
