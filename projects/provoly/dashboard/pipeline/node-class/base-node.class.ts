import { Store } from '@ngrx/store';
import { LGraphNode, LiteGraph } from 'litegraph.js';
import { v4 } from 'uuid';
import { PipelineActions } from '../store/pipeline.actions';

LiteGraph.NODE_DEFAULT_BGCOLOR = '#FFFFFF';
LiteGraph.NODE_TITLE_COLOR = 'transparent';

export class BaseNode extends LGraphNode {
  static store: Store;
  static check: () => void;
  titleColor: string;

  constructor(title?: string, ...other: any) {
    super();
    this.properties['id'] = v4();
    this.color = BaseNode.getNodeTitleColor();
    this.titleColor = '#FFFFFF';
    this.title = (this.type ?? '?').split('.')[(this.type ?? '?').split('.').length - 1] ?? '?';
  }

  static getNodeTitleColor() {
    return '#4E92E4';
  }

  override onSelected() {
    BaseNode.store.dispatch(PipelineActions.select({ id: this.properties['id'] }));
  }

  override onPropertyChanged(property: string, value: any, prevValue: any): void | boolean {
    BaseNode.check();
  }

  override onConnectionsChange() {
    BaseNode.check();
  }

  onDrawTitleText(ctx: any, title_height: any, size: any, scale: any, title_text_font: any, selected: any) {
    ctx.font = title_text_font;
    const title = this.getTitle();
    if (title) {
      ctx.fillStyle = this.titleColor;
      if (this.flags.collapsed) {
        ctx.textAlign = 'center';
        const measure = ctx.measureText(title);
        ctx.fillText(title, title_height + measure.width * 0.5, LiteGraph.NODE_TITLE_TEXT_Y - title_height);
        ctx.textAlign = 'left';
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(title, title_height, LiteGraph.NODE_TITLE_TEXT_Y - title_height);
      }
    }
  }
}
