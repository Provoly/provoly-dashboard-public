import { BaseNode, PipelineActions } from '@provoly/dashboard/pipeline';
import { LGraph, LiteGraph, SerializedLGraphNode } from 'litegraph.js';
import { v4 } from 'uuid';
import { SubGraphInput } from './sub-graph-input.class';
import { SubGraphOutput } from './sub-graph-output.class';

export class SubGraphNode extends BaseNode {
  subGraph: LGraph;
  private inputWidget: any;
  private outputWidget: any;

  constructor(title?: string, ...other: any) {
    super();
    this.properties['id'] = v4();
    this.properties['type'] = 'SubGraphNode';
    this.color = SubGraphNode.getNodeTitleColor();
    this.titleColor = '#000000';
    this.shape = LiteGraph.BOX_SHAPE;
    this.subGraph = new LGraph();
    this.inputWidget = this.addWidget(
      'combo',
      'inputs',
      0,
      (value) => {
        while (this.inputs.length > value) {
          this.destroyInput();
        }
        while (this.inputs.length < value) {
          this.createInput();
        }
      },
      { values: [0, 1, 2, 3, 4, 5] }
    );
    this.outputWidget = this.addWidget(
      'combo',
      'outputs',
      0,
      (value) => {
        while (this.outputs.length > value) {
          this.destroyOutput();
        }
        while (this.outputs.length < value) {
          this.createOutput();
        }
      },
      { values: [0, 1, 2, 3, 4, 5] }
    );
  }

  override onSelected() {
    BaseNode.store.dispatch(PipelineActions.select({ id: this.properties['id'] }));
  }

  static override getNodeTitleColor() {
    return '#a7f6fd';
  }

  createInput(id?: string) {
    const nextInputId = this.inputs.length;
    this.addInput(`input-items-${nextInputId}`, 'items');
    if (!id) {
      const node_const = LiteGraph.createNode('SubGraphInput', `input-items-${nextInputId}`, {});
      this.subGraph.add(node_const);
    }
    this.properties['inputs'] = this.inputs.length;
    this.inputWidget.value = this.inputs.length;
    BaseNode.check();
  }

  destroyInput() {
    this.removeInput(this.inputs.length - 1);
    const nodeInSubgraphToRemove = this.subGraph
      .findNodesByClass(SubGraphInput)
      .find((input) => input.title === `input-items-${this.inputs.length}`);
    if (nodeInSubgraphToRemove) {
      this.subGraph.remove(nodeInSubgraphToRemove);
    }
    this.properties['inputs'] = this.inputs.length;
    BaseNode.check();
  }

  createOutput(id?: string) {
    const nextOutputId = this.outputs.length;
    this.addOutput(`output-items-${nextOutputId}`, 'items');
    if (!id) {
      const node_const = LiteGraph.createNode('SubGraphOutput', `output-items-${nextOutputId}`, {});
      this.subGraph.add(node_const);
    }
    this.properties['outputs'] = this.outputs.length;
    this.outputWidget.value = this.outputs.length;
    BaseNode.check();
  }

  destroyOutput() {
    this.removeOutput(this.outputs.length - 1);
    const nodeInSubgraphToRemove = this.subGraph
      .findNodesByClass(SubGraphOutput)
      .find((output) => output.title === `output-items-${this.outputs.length}`);
    if (nodeInSubgraphToRemove) {
      this.subGraph.remove(nodeInSubgraphToRemove);
    }
    this.properties['outputs'] = this.outputs.length;
    BaseNode.check();
  }

  override onSerialize(o: SerializedLGraphNode) {
    if (o && o.properties) {
      o.properties['inputs'] = this.inputs.length;
      o.properties['outputs'] = this.outputs.length;
      o.properties['subgraph'] = this.subGraph?.serialize() ?? undefined;
    }
  }

  override onPropertyChanged(property: string, value: any, prevValue: any): void | boolean {
    BaseNode.check();
  }

  override onConnectionsChange() {
    BaseNode.check();
  }
}
