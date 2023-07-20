import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DataSourceActions, PryI18nService, SubscriptionnerDirective } from '@provoly/dashboard';
import { LGraph, LGraphCanvas, LGraphNode, LiteGraph } from 'litegraph.js';
import { auditTime, BehaviorSubject, combineLatest, combineLatestWith, fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PipelineComponentDefinition,
  PipelineComponentFactoryService
} from '../../factory/pipeline-component-factory.service';
import { BaseNode } from '../../node-class/base-node.class';
import { NodePipelineError, PipelineActions, PipelineResponse } from '../../store/pipeline.actions';
import { PipelineSelectors } from '../../store/pipeline.selectors';
import { GraphSerializerUtils } from './graph-serializer.utils';
import { PrySerializedPipeline, PryTransfo } from './pipeline.interface';

export const MIME_TYPE_PIPELINE_COMPONENT = 'pipeline/component';
export const MIME_TYPE_PIPELINE_PROPERTIES = 'pipeline/properties';

@Component({
  selector: 'pry-pipeline-editor',
  templateUrl: './pipeline-editor.component.html'
})
export class PryPipelineEditorComponent extends SubscriptionnerDirective implements AfterViewInit {
  @Input() pipeline?: PryTransfo;
  @Output() goToConsult = new EventEmitter<PryTransfo>();
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasParent') canvasParent!: ElementRef<HTMLDivElement>;
  @ViewChild('specific', { read: ViewContainerRef, static: false }) componentRef!: ViewContainerRef;
  lGraphs: LGraph[] = [];
  private lGraphCanvas!: LGraphCanvas;
  types$: Observable<{ [category: string]: PipelineComponentDefinition[] }>;
  categories$: Observable<string[]>;
  selectedNode$: Observable<BaseNode | undefined>;
  response$: Observable<PipelineResponse | undefined>;
  instanciatedComponent!: ComponentRef<any>;
  selectedNode?: BaseNode;
  actions = [] as { type: string; icon: string }[];
  errors$: Observable<(NodePipelineError & { translated: string })[]>;
  disableEditing: boolean = false;
  images: { start: HTMLImageElement; after: HTMLImageElement };
  categoryOpened: string = '';
  search$ = new BehaviorSubject<any>({});

  constructor(
    private store: Store,
    private pipelineComponentFactoryService: PipelineComponentFactoryService,
    private translateService: PryI18nService
  ) {
    super();
    BaseNode.store = store;
    BaseNode.check = () => this.check();

    this.store.dispatch(DataSourceActions.namedQuery.load());
    this.store.dispatch(DataSourceActions.dataset.loadDataset());

    this.types$ = combineLatest([pipelineComponentFactoryService.typesByCategories$, this.search$]).pipe(
      map(([typesByCategory, search]) => {
        const result = {} as { [category: string]: PipelineComponentDefinition[] };
        Object.keys(typesByCategory).forEach((cat) => {
          result[cat] = typesByCategory[cat].filter((type) =>
            type.label.toLocaleLowerCase().includes((search[cat] ?? '').toLocaleLowerCase())
          );
        });
        return result;
      })
    );
    this.categories$ = pipelineComponentFactoryService.categories$;

    this.selectedNode$ = this.store.select(PipelineSelectors.selectedNodeId).pipe(map((id) => this.findNodeById(id)));

    this.response$ = this.store.select(PipelineSelectors.checkResponse);

    this.subscriptions.add(
      this.response$.subscribe((response) => {
        this.allNodes.forEach((errorNode) => {
          // @ts-ignore
          delete errorNode?.bgcolor;
        });

        (response?.status.map((status) => status.errors).reduce((p, c) => [...p, ...c], []) ?? [])
          ?.map((error) => this.findNodeById(error.nodeId))
          .filter((errorNode) => !!errorNode)
          .forEach((errorNode) => (errorNode!.bgcolor = '#d93535'));

        this.refresh();
      })
    );

    this.selectedNode$.pipe(combineLatestWith(this.response$)).subscribe(([node, response]) => {
      if (this.instanciatedComponent) {
        this.componentRef.clear();
      }
      this.removeAction('down');
      if (node) {
        const module = this.pipelineComponentFactoryService.get(node?.type ?? '');
        if (module) {
          this.instanciatedComponent = this.componentRef.createComponent(module.component);
          this.instanciatedComponent.instance.node = node;
          this.instanciatedComponent.instance.checkFn = () => {};
          this.instanciatedComponent.instance.disabled = this.disableEditing;
          setTimeout(() => {
            this.instanciatedComponent.instance.checkFn = () => this.check();
          }, 100);

          if (response) {
            const matchingStatus = response.status.find((status) => status.nodeId === node.properties['id']);
            if (matchingStatus) {
              this.instanciatedComponent.instance.model = matchingStatus.outModel;
            }
          }
        }
        if (node.type === 'SubGraphNode') {
          this.addAction({ icon: 'eye-arrow-down', type: 'down' });
        }
        this.addAction({ icon: 'delete', type: 'delete' });
      } else {
        this.removeAction('delete');
      }
    });

    this.subscriptions.add(this.selectedNode$.subscribe((node) => (this.selectedNode = node)));

    this.errors$ = combineLatest([this.response$, this.selectedNode$]).pipe(
      map(([response, selectedNode]) => [
        ...(response?.errors ?? []).map((error) => ({ ...error, nodeId: '-' })),
        ...(response?.status.find((status) => status.nodeId === (selectedNode?.properties['id'] ?? '-----'))?.errors ??
          [])
      ]),
      map((errors) =>
        errors.map((error) => ({
          ...error,
          translated: this.translateService.instant('@pry.pipeline.codes.' + error.code, error)
        }))
      )
    );

    this.subscriptions.add(
      fromEvent(window, 'resize')
        .pipe(auditTime(100))
        .subscribe(() => {
          this.onResize();
        })
    );

    this.images = {
      start: new Image(),
      after: new Image()
    };
    this.images.start.src = '/assets/backgrounds/img_processus.png';
    this.images.after.src = '';
  }

  get currentGraph() {
    return this.lGraphs[this.lGraphs.length - 1];
  }

  get allNodes(): BaseNode[] {
    // @ts-ignore
    return this.currentGraph?._nodes ?? [];
  }

  get backgroundImage() {
    return (this.pipeline?.nodes ?? []).length > 0 ? this.images.after : this.images.start;
  }

  findNodeById(id: string) {
    return this.allNodes.find((node) => node.properties['id'] === id);
  }

  ngAfterViewInit(): void {
    this.lGraphs.push(new LGraph());
    this.lGraphCanvas = new LGraphCanvas(this.canvas.nativeElement, this.currentGraph);
    this.lGraphCanvas.allow_searchbox = false;
    this.lGraphCanvas.title_text_font = 'bold 14px Ubuntu';
    this.lGraphCanvas.inner_text_font = 'normal 12px Ubuntu';
    this.lGraphCanvas.default_link_color = '#000000';
    // @ts-ignore
    this.lGraphCanvas.background_image = undefined;
    this.lGraphCanvas.onDrawBackground = (ctx, vector) => {
      const rect = this.canvas.nativeElement.getBoundingClientRect();

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const imgSize = [306, 171];
      ctx.drawImage(
        this.backgroundImage,
        (rect.width - imgSize[0]) / 2,
        (rect.height - imgSize[1]) / 2,
        imgSize[0],
        imgSize[1]
      );
    };
    this.lGraphCanvas.onNodeDeselected = () => {
      this.store.dispatch(PipelineActions.select({ id: '' }));
    };
    this.currentGraph.start();
    if (this.pipeline) {
      GraphSerializerUtils.hydrate(this.pipeline as PrySerializedPipeline, this.currentGraph);
      this.disableEditing = this.pipeline.active;
    }
    this.onResize();
  }

  onResize() {
    // Make canvas so little that it doesn't impact css size calculation
    this.canvas.nativeElement.width = 10;
    this.canvas.nativeElement.height = 10;
    this.lGraphCanvas.resize(10, 10);

    // Later, make it grow to proper size
    setTimeout(() => {
      const rect = this.canvasParent.nativeElement.getBoundingClientRect();
      this.canvas.nativeElement.width = rect.width;
      this.canvas.nativeElement.height = rect.height;
      this.lGraphCanvas.resize(rect.width, rect.height);
      this.refresh();
    }, 10);
  }

  displayGraph(graph: LGraph) {
    this.currentGraph.stop();
    this.lGraphs.push(graph);
    this.lGraphCanvas.setGraph(graph);
    graph.start();
  }

  popGraph() {
    this.currentGraph.stop();
    this.lGraphs.length = this.lGraphs.length - 1;
    this.currentGraph.start();
    this.lGraphCanvas.setGraph(this.currentGraph);
    this.store.dispatch(PipelineActions.select({ id: '' }));
    this.lGraphCanvas.deselectAllNodes();
    if (this.lGraphs.length === 1) {
      this.removeAction('up');
    }
  }

  pupGraph(node: BaseNode) {
    // @ts-ignore
    if (!!node.subGraph) {
      // @ts-ignore
      this.displayGraph(node.subGraph);
      this.store.dispatch(PipelineActions.select({ id: '' }));
      this.lGraphCanvas.deselectAllNodes();
      this.addAction({ icon: 'eye-arrow-up', type: 'up' });
    }
  }

  check() {
    if (!this.disableEditing) {
      this.pipeline = {
        ...this.pipeline,
        ...GraphSerializerUtils.serialize(this.lGraphs[0], this.pipeline?.id)
      } as PryTransfo;
      setTimeout(() => {
        this.store.dispatch(
          PipelineActions.check({
            graph: {
              id: this.pipeline?.id,
              nodes: this.pipeline?.nodes,
              links: this.pipeline?.links,
              title: this.pipeline?.title,
              description: this.pipeline?.description
            }
          })
        );
      }, 100);
    }
  }

  refresh() {
    this.currentGraph?.change();
  }

  createNode(type: string, position: [number, number], additionalProperties: any) {
    const title = additionalProperties._label ?? type.split('.')[type.split('.').length - 1] ?? '?';
    const node_const = LiteGraph.createNode(type, title, {});
    if (node_const !== null) {
      node_const.title = title;
      node_const.pos = position;
      Object.keys(additionalProperties).forEach((key) => {
        node_const.properties[key] = additionalProperties[key];
      });

      this.currentGraph.add(node_const);
    } else {
      console.error(`Cannot create node of type ${type}`);
    }
  }

  onDragStart($event: DragEvent, component: PipelineComponentDefinition) {
    if (!!$event && !!$event.dataTransfer && !$event.dataTransfer.types.includes(MIME_TYPE_PIPELINE_COMPONENT)) {
      $event.dataTransfer.dropEffect = 'copy';
      $event.dataTransfer.effectAllowed = 'copy';
      $event.dataTransfer.setData(MIME_TYPE_PIPELINE_COMPONENT, component.type);
      $event.dataTransfer.setData(MIME_TYPE_PIPELINE_PROPERTIES, JSON.stringify({ ...component.additionalProperties }));
    }
  }

  onDrop($event: DragEvent) {
    $event.preventDefault();
    if (!!$event && !!$event.dataTransfer) {
      if ($event.dataTransfer.types.includes(MIME_TYPE_PIPELINE_COMPONENT)) {
        const componentType = $event.dataTransfer.getData(MIME_TYPE_PIPELINE_COMPONENT);
        const additionalProperties = JSON.parse($event.dataTransfer.getData(MIME_TYPE_PIPELINE_PROPERTIES));
        const convertedEvent = this.lGraphCanvas.convertEventToCanvasOffset($event);
        this.createNode(componentType, [convertedEvent[0], convertedEvent[1]], additionalProperties);
        this.check();
        $event.stopPropagation();
      }
    }
  }

  changeTitle(node: LGraphNode, $event: Event) {
    // @ts-ignore
    node.title = $event.target?.value;
    this.refresh();
  }

  clickedAction(action: any) {
    switch (action.type) {
      case 'up':
        this.popGraph();
        break;
      case 'down':
        this.pupGraph(this.selectedNode!);
        break;
      case 'delete':
        this.currentGraph.remove(this.selectedNode!);
        this.removeAction('delete');
        this.check();
        break;
    }
    this.store.dispatch(PipelineActions.select({ id: '' }));
  }

  addAction(add: { type: string; icon: string }) {
    if (!this.actions.find((action) => action.type === add.type)) {
      this.actions.push(add);
    }
    this.actions.sort((a, b) => a.type.localeCompare(b.type));
  }

  removeAction(type: string) {
    this.actions = this.actions.filter((action) => action.type !== type);
  }

  goBack() {
    this.goToConsult.emit(this.pipeline);
  }

  toggle(category: string) {
    this.categoryOpened = this.categoryOpened === category ? '' : category;
  }

  search(category: string, $event: any) {
    this.search$.next({ ...this.search$.getValue(), [category]: $event });
  }
}
