import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassSelectors,
  ContextMenuActions,
  DashboardActions,
  DashboardSelectors,
  DataWidgetComponent,
  GraphWidgetOptions,
  Item,
  PryI18nService,
  RelationType,
  RelationTypesActions,
  RelationTypesSelectors,
  SymbolService,
  TooltipFactoryService,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import {
  auditTime,
  BehaviorSubject,
  combineLatest,
  delay,
  filter,
  from,
  map,
  mergeMap,
  Observable,
  Subject
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { PryLink, PryNode } from '../layout/node.interface';
import { simpleSimulation } from '../layout/simple.function';

@Component({
  selector: 'pry-widget-graph',
  templateUrl: './widget-graph.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetGraphComponent extends DataWidgetComponent implements AfterViewInit, OnDestroy {
  options$: Observable<GraphWidgetOptions>;
  options!: GraphWidgetOptions;
  optionsCopy?: GraphWidgetOptions;
  selectedIds$: Observable<string[]>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tooltip', { read: ViewContainerRef }) tooltip!: ViewContainerRef;
  classes$: Observable<Class[]>;
  viewSize$: Observable<[number, number]>;
  context: CanvasRenderingContext2D | null = null;
  simulation!: any;
  allItemsWithImages$: Observable<{ item: Item; image: HTMLCanvasElement }[]>;
  itemsAsNodes: PryNode[] = [];
  relationsAsLinks: PryLink[] = [];
  draggedNode?: PryNode;
  tooltip$ = new BehaviorSubject({
    x: 0,
    y: 0,
    item: null as unknown as PryNode,
    display: false
  });
  dragging: boolean = false;
  selectRect?: { start: { x: number; y: number }; end: { x: number; y: number } };
  relationTypes: RelationType[] = [];
  move$ = new Subject<MouseEvent>();
  mode: 'move' | 'rectangle' = 'move';
  offset = [0, 0];
  additionnalOffset: [number, number] = [0, 0];
  layouts = [{ key: 'simple' }, { key: 'force' }];
  mouseDown: boolean = false;

  constructor(
    store: Store<any>,
    private tooltipFactoryService: TooltipFactoryService,
    private translateService: PryI18nService,
    private symbolService: SymbolService,
    private sanitizer: DomSanitizer,
    el: ElementRef,
    private _injector: Injector
  ) {
    super(store, el);

    this.classes$ = this.store.select(ClassSelectors.classes);
    this.selectedIds$ = this.store.select(DashboardSelectors.selectedItemIds);
    this.store.dispatch(RelationTypesActions.load());
    this.options$ = this.manifest$.pipe(
      map(
        (manifest) =>
          ({
            linkStrokeColor: '#999',
            linkStrokeOpacity: 0.6,
            linkStrokeWidth: 1.5,
            linkStrokeLinecap: 'round',
            nodeStrokeColor: '#fff',
            nodeStrokeWidth: 1.5,
            nodeStrokeOpacity: 1,
            nodeRadius: 25,
            layout: 'simple',
            ...manifest.options
          }) as GraphWidgetOptions
      )
    );

    this.subscriptions.add(
      this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
        this.options = options;
        this.optionsCopy = { ...(structuredClone(options) as GraphWidgetOptions) };
      })
    );

    this.viewSize$ = combineLatest([this.widgetSize$, this.displayHeader$]).pipe(
      delay(10),
      map(
        ([size, header]) =>
          [size.width, size.height - (header ? WIDGET_HEADER_HEIGHT.value : 0) - 10] as [number, number]
      ),
      tap((size) => {
        if (this.canvas) {
          this.canvas.nativeElement.width = size[0];
          this.canvas.nativeElement.height = size[1];
        }
      })
    );

    this.allItemsWithImages$ = this.allItems$.pipe(
      mergeMap((items) =>
        from(
          new Promise<{ item: Item; image: HTMLCanvasElement }[]>((resolve, reject) => {
            Promise.all(items.map((item) => this.symbolService.getSymbol(item))).then((canvases) =>
              resolve(
                items.map((item, idx) => ({
                  item,
                  image: canvases[idx]
                }))
              )
            );
          })
        )
      )
    );

    combineLatest([
      this.allItemsWithImages$,
      this.resultSet$.pipe(map((rs) => rs.relations)),
      this.viewSize$,
      this.options$,
      this.store.select(RelationTypesSelectors.relationsTypes).pipe(tap((rt) => (this.relationTypes = rt))),
      this.selectedIds$
    ]).subscribe(([items, relations, size, options, relationTypes, selectedIds]) => {
      this.itemsAsNodes = items.map((itemWithImage, idx) => ({
        index: idx,
        item: itemWithImage.item,
        id: itemWithImage.item.id,
        image: itemWithImage.image,
        selected: selectedIds.indexOf(itemWithImage.item.id) > -1
      })) as PryNode[];

      const unknownImage = new Image();
      unknownImage.src = '/assets/svgs/question-line.svg';

      // Complete missing nodes
      relations.forEach((relation) => {
        if (!this.itemsAsNodes.find((item) => item.id === relation.source)) {
          this.itemsAsNodes.push({
            index: this.itemsAsNodes.length,
            item: { id: relation.source, oClass: 'unknown', attributes: {} },
            id: relation.source,
            image: unknownImage,
            selected: selectedIds.indexOf(relation.source) > -1
          });
        }
        if (!this.itemsAsNodes.find((item) => item.id === relation.destination)) {
          this.itemsAsNodes.push({
            index: this.itemsAsNodes.length,
            item: { id: relation.destination, oClass: 'unknown', attributes: {} },
            id: relation.destination,
            image: unknownImage,
            selected: selectedIds.indexOf(relation.destination) > -1
          });
        }
      });

      this.relationsAsLinks = relations.map((relation) => ({
        source: this.itemsAsNodes.find((item) => item.id === relation.source)?.index ?? -1,
        target: this.itemsAsNodes.find((item) => item.id === relation.destination)?.index ?? -1,
        relation
      })) as PryLink[];

      if (this.simulation) {
        this.simulation.stop();
      }

      this.simulation = this.initSimulation(options, size).on('tick', this.draw(size, options, relationTypes));
    });

    this.subscriptions.add(
      this.tooltip$.pipe(filter((tooltip) => !!tooltip && !!tooltip.item)).subscribe((tooltip) => {
        let type = tooltip.item.item.oClass as string;
        this.tooltip.clear();
        const component$ = this.tooltipFactoryService.generateTooltip(type, this._injector, this.tooltip);
        component$.subscribe((component) => {
          if (component) {
            component.instance.data.item = tooltip.item.item;
          }
        });
      })
    );

    this.move$.pipe(auditTime(30)).subscribe(($event) => this.moveCallback($event));
  }

  initSimulation(options: GraphWidgetOptions, size: [number, number]) {
    switch (options.layout) {
      case 'simple':
        return simpleSimulation(this.itemsAsNodes, this.relationsAsLinks, options, size);
      case 'force':
      default:
        return forceSimulation(this.itemsAsNodes)
          .force('charge', forceManyBody())
          .force('link', forceLink(this.relationsAsLinks).distance(50).strength(0.1))
          .force('x', forceX())
          .force('y', forceY())
          .force('collide', forceCollide(options.nodeRadius * 3))
          .force('center', forceCenter(size[0] / 2, size[1] / 2));
    }
  }

  override emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }

  refresh() {
    this.draw([this.canvas.nativeElement.width, this.canvas.nativeElement.height], this.options, this.relationTypes)();
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  changeMode(mode: 'move' | 'rectangle') {
    this.mode = mode;
  }

  changeLayout($event: any) {
    this.optionsCopy!.layout = $event;
  }

  changeNodeRadius($event: any) {
    this.optionsCopy!.nodeRadius = $event;
  }

  /**
   * Drawing things
   */

  draw(size: [number, number], options: GraphWidgetOptions, relationTypes: RelationType[]) {
    return () => {
      if (this.context) {
        // Clear canvas
        this.context.clearRect(0, 0, size[0], size[1]);

        // Drawing links
        this.context.save();
        this.drawLinks(options, relationTypes);
        this.context.restore();

        // Drawing nodes
        this.context.save();
        this.drawNodes(options);
        this.context.restore();

        // Drawing selection rectangle if needed
        if (this.selectRect) {
          this.context.save();
          this.drawSelectionRect();
          this.context.restore();
        }
      }
    };
  }

  private drawSelectionRect() {
    if (this.context && this.selectRect && this.mode === 'rectangle') {
      this.context.globalAlpha = 0.3;
      this.context.fillStyle = '#bcdcda';

      const minX = Math.min(this.selectRect.start.x, this.selectRect.end.x);
      const minY = Math.min(this.selectRect.start.y, this.selectRect.end.y);
      const dX = Math.abs(this.selectRect.start.x - this.selectRect.end.x);
      const dY = Math.abs(this.selectRect.start.y - this.selectRect.end.y);

      this.context.rect(minX, minY, dX, dY);
      this.context.fill();
    }
  }

  private drawNodes(options: GraphWidgetOptions) {
    if (this.context) {
      this.context.globalAlpha = options.nodeStrokeOpacity;
      for (const [i, node] of this.itemsAsNodes.entries()) {
        this.context.beginPath();
        this.context.moveTo((node.x ?? 0) + this.globalOffset[0], (node.y ?? 0) + this.globalOffset[1]);
        this.context.arc(
          (node.x ?? 0) + this.globalOffset[0],
          (node.y ?? 0) + this.globalOffset[1],
          options.nodeRadius / 2 + 8,
          0,
          2 * Math.PI,
          false
        );
        this.context.fillStyle = node.selected ? '#569a9c' : node.item.oClass === 'unknown' ? '#e2a7a7' : '#ecedf4';
        this.context.strokeStyle = node.selected ? '#569a9c' : node.item.oClass === 'unknown' ? '#e2a7a7' : '#ecedf4';
        this.context.fill();
        this.context.stroke();
        this.context.drawImage(
          node.image,
          (node.x ?? 0) + this.globalOffset[0] - options.nodeRadius / 2,
          (node.y ?? 0) + this.globalOffset[1] - options.nodeRadius / 2,
          options.nodeRadius,
          options.nodeRadius
        );
      }
    }
  }

  private drawLinks(options: GraphWidgetOptions, relationTypes: RelationType[]) {
    if (this.context) {
      this.context.globalAlpha = options.linkStrokeOpacity;
      for (const [i, link] of this.relationsAsLinks.entries()) {
        this.context.beginPath();
        const sourceNode = this.itemsAsNodes.find((item) => item.id === link.relation.source);
        let targetNode = this.itemsAsNodes.find((item) => item.id === link.relation.destination);
        if (link.source === link.target && targetNode) {
          this.context.moveTo((sourceNode?.x ?? 0) + this.globalOffset[0], (sourceNode?.y ?? 0) + this.globalOffset[1]);
          this.context.bezierCurveTo(
            (sourceNode?.x ?? 0) - 10 + this.globalOffset[0],
            (sourceNode?.y ?? 0) - 60 + this.globalOffset[1],
            (sourceNode?.x ?? 0) + 120 + this.globalOffset[0],
            (sourceNode?.y ?? 0) + this.globalOffset[1],
            (sourceNode?.x ?? 0) - 10 + this.globalOffset[0],
            (sourceNode?.y ?? 0) + 20 + this.globalOffset[1]
          );
          const { middleX, middleY, angle } = this.drawSelfRelationTextLink(link, sourceNode!, relationTypes, options);
          // arrow
          this.drawArrow(
            (targetNode?.x ?? 0) + 120 + this.globalOffset[0],
            (targetNode?.y ?? 0) + this.globalOffset[1],
            middleX,
            middleY + 3,
            angle - 100
          );
        } else {
          this.context.moveTo((sourceNode?.x ?? 0) + this.globalOffset[0], (sourceNode?.y ?? 0) + this.globalOffset[1]);
          this.context.lineTo((targetNode?.x ?? 0) + this.globalOffset[0], (targetNode?.y ?? 0) + this.globalOffset[1]);
          const { middleX, middleY, angle } = this.drawTextLink(link, sourceNode!, targetNode!, relationTypes, options);
          // arrow
          this.drawArrow(
            (targetNode?.x ?? 0) + this.globalOffset[0],
            (targetNode?.y ?? 0) + this.globalOffset[1],
            middleX,
            middleY,
            angle
          );
        }
      }
    }
  }

  private drawSelfRelationTextLink(
    link: PryLink,
    sourceNode: PryNode,
    relationTypes: RelationType[],
    options: GraphWidgetOptions
  ) {
    const middleX = (sourceNode?.x ?? 0) + this.globalOffset[0] + 45;
    const middleY = (sourceNode?.y ?? 0) + this.globalOffset[1] - 20;
    let angle = Math.atan2(sourceNode?.y ?? 0, sourceNode?.x ?? 0);
    let drawAngle = angle;

    return this.drawText(middleX, middleY, angle, relationTypes, options, link, drawAngle);
  }

  private drawTextLink(
    link: PryLink,
    sourceNode: PryNode,
    targetNode: PryNode,
    relationTypes: RelationType[],
    options: GraphWidgetOptions
  ) {
    const middleX = ((sourceNode?.x ?? 0) + (targetNode?.x ?? 0)) / 2 + this.globalOffset[0];
    const middleY = ((sourceNode?.y ?? 0) + (targetNode?.y ?? 0)) / 2 + this.globalOffset[1];
    let angle = Math.atan2((targetNode?.y ?? 0) - (sourceNode?.y ?? 0), (targetNode?.x ?? 0) - (sourceNode?.x ?? 0));
    let drawAngle = angle;
    if (this.context) {
      if ((sourceNode?.x ?? 0) > (targetNode?.x ?? 0)) {
        drawAngle += Math.PI;
      }
    }

    return this.drawText(middleX, middleY, angle, relationTypes, options, link, drawAngle);
  }

  private drawText(
    middleX: number,
    middleY: number,
    angle: number,
    relationTypes: any[],
    options: GraphWidgetOptions,
    link: PryLink,
    drawAngle: number
  ) {
    if (this.context) {
      this.context.font = '10px Ubuntu';
      const relationType = link.relation.relationType;
      this.context.save();
      this.context.translate(middleX, middleY);
      this.context.rotate(drawAngle);
      this.context.textAlign = 'center';
      this.context.fillText(relationTypes.find((relT) => relT.id === relationType)?.name ?? relationType, 0, -7);
      this.context.strokeStyle = options.linkStrokeColor;
      this.context.lineWidth = options.linkStrokeWidth;
      this.context.stroke();
      this.context.restore();
    }
    return { middleX, middleY, angle };
  }

  private drawArrow(targetX: number, targetY: number, middleX: number, middleY: number, angle: number) {
    if (this.context) {
      const width = 1;
      const headlen = 10;

      // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
      targetX -= Math.cos(angle) * (width * 1.15);
      targetY -= Math.sin(angle) * (width * 1.15);

      //starting a new path from the head of the arrow to one of the sides of the point
      this.context.beginPath();
      this.context.moveTo(middleX, middleY);
      this.context.lineTo(
        middleX - headlen * Math.cos(angle - Math.PI / 7),
        middleY - headlen * Math.sin(angle - Math.PI / 7)
      );

      //path from the side point of the arrow, to the other side point
      this.context.lineTo(
        middleX - headlen * Math.cos(angle + Math.PI / 7),
        middleY - headlen * Math.sin(angle + Math.PI / 7)
      );

      //path from the side point back to the tip of the arrow, and then again to the opposite side point
      this.context.lineTo(middleX, middleY);
      this.context.lineTo(
        middleX - headlen * Math.cos(angle - Math.PI / 7),
        middleY - headlen * Math.sin(angle - Math.PI / 7)
      );

      //draws the paths created above
      this.context.lineWidth = width;
      this.context.stroke();
      this.context.fill();
    }
  }

  /**
   * Mouse Management
   */

  onMouseDown($event: MouseEvent) {
    const nodes = this.findNodes($event);
    this.draggedNode = nodes[0];
    if (this.draggedNode) {
      this.simulation.alphaTarget(0.3).restart();
      this.draggedNode.fx = this.draggedNode.x;
      this.draggedNode.fy = this.draggedNode.y;
    } else {
      this.selectRect = {
        start: { x: $event.offsetX, y: $event.offsetY },
        end: { x: $event.offsetX, y: $event.offsetY }
      };
      this.refresh();
    }
    this.mouseDown = true;
  }

  onMouseMove($event: MouseEvent) {
    this.move$.next($event);
    if (this.mouseDown) {
      this.dragging = true;
    }
  }

  moveCallback($event: MouseEvent) {
    if (this.draggedNode) {
      this.draggedNode.fx = $event.offsetX - this.globalOffset[0];
      this.draggedNode.fy = $event.offsetY - this.globalOffset[1];
    } else {
      if (this.selectRect) {
        this.selectRect!.end = { x: $event.offsetX, y: $event.offsetY };
        if (this.mode === 'move') {
          this.additionnalOffset = [
            this.selectRect.end.x - this.selectRect.start.x,
            this.selectRect.end.y - this.selectRect.start.y
          ];
        }
      }
      this.refresh();
    }

    // display tooltip for nodes
    const nodes = this.findNodes($event);
    this.tooltip$.next({ item: nodes[0], display: nodes.length > 0, x: $event.offsetX, y: $event.offsetY });
  }

  onMouseUp($event: MouseEvent, leave = false) {
    if ($event.button !== 2) {
      if (this.dragging) {
        if (this.draggedNode) {
          this.simulation.alphaTarget(0);
          if (this.optionsCopy?.layout === 'force') {
            this.draggedNode.fx = null;
            this.draggedNode.fy = null;
          }
        } else {
          if (this.mode === 'rectangle') {
            const nodes = this.findNodesInShaped(this.selectRect!);
            this.store.dispatch(DashboardActions.selectMany({ ids: nodes.map((node) => node.item.id) }));
            this.refresh();
          } else {
            this.offset = [...this.globalOffset];
            this.additionnalOffset = [0, 0];
          }
        }
      } else {
        if (!leave) {
          const nodes = this.findNodes($event);
          if (nodes[0]?.item?.id) {
            this.store.dispatch(DashboardActions.select({ id: nodes[0]?.item?.id, cumulative: $event.shiftKey }));
          } else {
            this.store.dispatch(DashboardActions.select({ id: '', cumulative: $event.shiftKey }));
          }
        }
      }
    }
    this.mode = 'move';
    this.selectRect = undefined;
    this.draggedNode = undefined;
    this.dragging = false;
    this.mouseDown = false;
  }

  get globalOffset() {
    return [this.offset[0] + this.additionnalOffset[0], this.offset[1] + this.additionnalOffset[1]];
  }

  contextMenu($event: MouseEvent) {
    if (this.manifest.contextMenu !== false) {
      $event.preventDefault();
      const nodes = this.findNodes($event);
      if (nodes[0] && nodes[0].item) {
        this.store.dispatch(
          ContextMenuActions.open({
            itemId: nodes[0].item.id,
            clientX: $event.clientX,
            clientY: $event.clientY,
            resultSet: Array.isArray(this.manifest.datasource) ? this.manifest.datasource[0] : this.manifest.datasource,
            from: 'graph',
            allowObjectCreation: false
          })
        );
      }
    }
    this.onMouseUp($event, true);
  }

  /**
   * Finding Nodes
   */

  findNodes($event: MouseEvent) {
    return this.itemsAsNodes.filter(
      (item) =>
        Math.pow((item.x ?? 0) - $event.offsetX + this.globalOffset[0], 2) +
          Math.pow((item.y ?? 0) + this.globalOffset[1] - $event.offsetY, 2) <
        Math.pow(this.options.nodeRadius / 2 + 8, 2)
    );
  }

  private findNodesInShaped(shape: { start: { x: number; y: number }; end: { x: number; y: number } }): PryNode[] {
    const minX = Math.min(shape.start.x, shape.end.x);
    const maxX = Math.max(shape.start.x, shape.end.x);
    const minY = Math.min(shape.start.y, shape.end.y);
    const maxY = Math.max(shape.start.y, shape.end.y);

    return this.itemsAsNodes.filter(
      (item) =>
        (item.x ?? 0) + this.globalOffset[0] > minX &&
        (item.x ?? 0) + this.globalOffset[0] < maxX &&
        (item.y ?? 0) + this.globalOffset[1] > minY &&
        (item.y ?? 0) + this.globalOffset[1] < maxY
    );
  }

  override toImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.canvas.nativeElement.toDataURL('image/png'));
    });
  }
}
