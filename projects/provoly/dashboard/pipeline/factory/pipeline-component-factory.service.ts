import { Injectable, Type } from '@angular/core';
import { LiteGraph } from 'litegraph.js';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';
import { PipelinePropertiesPanelComponent } from '../components/pipeline-properties-panel.component';
import { BaseNode } from '../node-class/base-node.class';

export interface PipelineComponentDefinition {
  type: string;
  label: string;
  component: Type<PipelinePropertiesPanelComponent>;
  nodeClass: Type<BaseNode>;
  draggable: boolean;
  category: 'operation' | 'input' | 'output';
  additionalProperties: any;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class PipelineComponentFactoryService {
  referential$ = new BehaviorSubject<PipelineComponentDefinition[]>([]);
  public typesByCategories$: Observable<{ [category: string]: PipelineComponentDefinition[] }>;
  public categories$: Observable<string[]>;

  constructor() {
    this.typesByCategories$ = this.referential$.pipe(
      map((ref) => ref.filter((component) => component.draggable)),
      map((ref) => {
        const categories = {} as { [category: string]: PipelineComponentDefinition[] };

        ref.forEach((componentDef) => {
          if (!categories[componentDef.category]) {
            categories[componentDef.category] = [];
          }
          categories[componentDef.category].push(componentDef);
        });

        Object.keys(categories).forEach((category) =>
          categories[category].sort((a, b) => a.label.localeCompare(b.label))
        );

        return categories;
      })
    );

    this.categories$ = this.typesByCategories$.pipe(map((typesByCategories) => Object.keys(typesByCategories).sort()));
  }

  addType(
    type: string,
    component: Type<PipelinePropertiesPanelComponent>,
    nodeClass: Type<BaseNode>,
    category: 'operation' | 'input' | 'output' = 'operation',
    label = '',
    draggable = true,
    additionalProperties = {}
  ) {
    const shortLabel = label.length > 0 ? label : type.split('.')[type.split('.').length - 1];
    this.referential$.next([
      ...this.referential$.getValue().filter((ref) => ref.type !== type || ref.label !== shortLabel),
      {
        type,
        component,
        nodeClass,
        draggable,
        category,
        label: shortLabel,
        additionalProperties,
        // @ts-ignore
        color: nodeClass.getNodeTitleColor()
      }
    ]);
    if (LiteGraph.getNodeType(type)) {
      LiteGraph.unregisterNodeType(type);
    }
    LiteGraph.registerNodeType(type, nodeClass);
  }

  removeType(type: string) {
    this.referential$.next([...this.referential$.getValue().filter((component) => component.type !== type)]);
  }

  get(type: string): PipelineComponentDefinition {
    return this.referential$.getValue().find((component) => component.type === type) as PipelineComponentDefinition;
  }
}
