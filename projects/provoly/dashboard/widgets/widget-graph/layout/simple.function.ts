import { GraphWidgetOptions } from '@provoly/dashboard';
import { PryLink, PryNode } from './node.interface';

export const simpleSimulation = (
  _nodes: PryNode[],
  links: PryLink[],
  options: GraphWidgetOptions,
  size: [number, number]
) => {
  let tickFn = () => {};

  const nodes = topologicalSort(_nodes, links);

  const nodesByLevel = [] as PryNode[][];
  nodesByLevel[0] = [nodes[0]];

  let remainingNodes = getRemainingNodes(nodesByLevel, nodes);
  let currentLevel = 1;
  let previousRemainingNodes = 0;

  while (remainingNodes.length > 0) {
    if (previousRemainingNodes == remainingNodes.length) {
      // No new node reached, add one of the remaining node to the set, and restart looping
      currentLevel = 1;
      previousRemainingNodes = 0;
      nodesByLevel[0].push(remainingNodes[0]);
      remainingNodes = getRemainingNodes(nodesByLevel, nodes);
    }

    let nextNodes = nodesByLevel[currentLevel - 1]
      .map(
        (rootNode) =>
          links
            .filter((link) => rootNode.index === link.source)
            .map((link) => nodes.find((node) => link.target === node.index))
            .filter((node) => !!node) as PryNode[]
      )
      .reduce((p: PryNode[], c) => [...p, ...c], [] as PryNode[]);

    nextNodes = nextNodes.filter((node) => remainingNodes.map((remainingNode) => remainingNode.id).includes(node.id));

    nodesByLevel[currentLevel] = (nodesByLevel[currentLevel] ?? []).concat(...nextNodes);
    previousRemainingNodes = remainingNodes.length;
    remainingNodes = getRemainingNodes(nodesByLevel, nodes);
    currentLevel++;
  }

  let interval: any;

  const that = {
    on: (type: string, fn: () => void) => {
      if (type === 'tick') {
        tickFn = fn;
      }
      return that;
    },
    stop: () => {
      clearInterval(interval);
      return that;
    },
    start: () => {
      interval = setInterval(() => {
        calculateLayout(nodesByLevel, options, size);
        tickFn();
      }, 100);
      return that;
    },
    restart: () => {
      that.stop().start();
      return that;
    },
    alphaTarget: () => {
      return that;
    }
  };

  return that.start();
};

const getUsedNodes = (nodesByLevel: PryNode[][]) => {
  return nodesByLevel.map((nodes) => (nodes ?? []).map((node) => node?.id)).reduce((p, c) => [...p, ...c], []);
};

const getRemainingNodes = (nodesByLevel: PryNode[][], allNodes: PryNode[]) => {
  const usedNodes = getUsedNodes(nodesByLevel);
  return allNodes.filter((node) => !usedNodes.includes(node.id));
};

const calculateLayout = (nodesByLevel: PryNode[][], options: GraphWidgetOptions, size: [number, number]) => {
  const margin = options.nodeRadius * 2;
  const hSpacing = options.nodeRadius * 8;
  const vSpacing = options.nodeRadius * 2;
  nodesByLevel.forEach((nodesOfLevel, lvl) => {
    nodesOfLevel
      .filter((node) => !!node)
      .forEach((node, idxInLevel) => {
        node.x = node.fx ?? margin + 10 + hSpacing * lvl;
        node.y = node.fy ?? margin + idxInLevel * vSpacing;
      });
  });
};

const topologicalSort = (nodes: PryNode[], links: PryLink[]) => {
  const result = [] as PryNode[];
  nodes.forEach((node) => (node.topologicalColor = 'WHITE'));

  nodes.forEach((node) => {
    if (node.topologicalColor === 'WHITE') {
      recursiveTopologicalSort(nodes, result, node, links);
    }
  });

  return result.reverse();
};

const recursiveTopologicalSort = (nodes: PryNode[], result: PryNode[], node: PryNode, links: PryLink[]) => {
  node.topologicalColor = 'GREY';
  const neighbors = nodes.filter(
    (potentialNeighbor) =>
      links.filter((link) => link.target === potentialNeighbor.index && link.source === node.index).length > 0
  );
  neighbors.forEach((neighbor) => {
    if (neighbor.topologicalColor === 'WHITE') {
      recursiveTopologicalSort(nodes, result, neighbor, links);
    }
  });
  node.topologicalColor = 'BLACK';
  result.push(node);
};
