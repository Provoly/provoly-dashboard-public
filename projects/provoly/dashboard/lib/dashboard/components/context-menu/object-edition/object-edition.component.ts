import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AttributeMultipleValue, AttributeSimpleValue, Item } from '../../../../core/model/item.interface';
import { Attribute, Class } from '../../../../core/store/class/class.interface';
import { ClassSelectors } from '../../../../core/store/class/class.selectors';
import { ConfigActions } from '../../../../core/store/config/config.actions';
import { ContextMenuSelectors } from '../../../../core/store/context-menu/context-menu.selectors';
import { Field, FieldType } from '../../../../core/store/field/field.interface';
import { FieldSelectors } from '../../../../core/store/field/field.selectors';
import { ItemActions } from '../../../../core/store/item/item.actions';
import { RelationTypesActions } from '../../../../core/store/relation-types/relation-types.actions';
import { RelationTypesSelectors } from '../../../../core/store/relation-types/relation-types.selectors';
import { DateUtils } from '../../../date-utils';
import { ItemUtils } from '../../../item-utils';
import { DashboardSelectors } from '../../../store/dashboard.selectors';
import { SubscriptionnerDirective } from '../../subscriptionner.directive';

export const HTTP_ORIGIN_METADATA = '_http_origin';

@Component({
  selector: 'pry-object-creation',
  templateUrl: './object-edition.component.html'
})
export class PryObjectEditionComponent extends SubscriptionnerDirective {
  @Input() link: boolean = false;
  @Input() object: boolean = false;
  @Input() menu: boolean = false;

  private overlayRef?: OverlayRef;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  itemId$: Observable<string>;
  from$: Observable<string>;
  itemId?: string;
  coordinates: number[] | undefined;
  tmpObject: Item = this.newObject();
  from: string = '';
  @Output() closed = new EventEmitter<void>();
  classes: Class[] = [];
  fields: Field[] = [];
  FieldType = FieldType;
  relations$: Observable<{ id: string; label: string }[]>;
  relation!: { typeId: string; itemId: string };
  selectedItemsIds!: string[];
  UPLOAD_METHOD = 'upload';
  HTTP_ORIGIN_METHOD = 'metadata';
  HTTP_ORIGIN_METADATA = HTTP_ORIGIN_METADATA;
  rawMethods = [
    { id: this.HTTP_ORIGIN_METHOD, name: '@pry.admin.fields.rawMethods.http' },
    {
      id: this.UPLOAD_METHOD,
      name: '@pry.admin.fields.rawMethods.upload'
    }
  ];
  method = this.UPLOAD_METHOD;
  selectedDatePicker: string = '';
  inversion: boolean = false;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private store: Store
  ) {
    super();
    this.itemId$ = this.store.select(ContextMenuSelectors.itemId);
    this.subscriptions.add(
      this.store.select(ContextMenuSelectors.coordinates).subscribe((coordinates) => (this.coordinates = coordinates))
    );
    this.subscriptions.add(this.itemId$.subscribe((itemId) => (this.itemId = itemId)));
    this.from$ = this.store.select(ContextMenuSelectors.from);
    this.relations$ = this.store
      .select(RelationTypesSelectors.relationsTypes)
      .pipe(map((relations) => (relations || []).map((rel) => ({ id: rel.id, label: rel.name }))));
    this.subscriptions.add(
      combineLatest([this.from$, this.store.select(ClassSelectors.classes)])
        .pipe(map(([from, classes]) => classes.filter((clazz) => from !== 'map' || ItemUtils.hasLocation(clazz))))
        .subscribe((classes) => (this.classes = classes))
    );
    this.subscriptions.add(this.store.select(FieldSelectors.fields).subscribe((fields) => (this.fields = fields)));
    this.subscriptions.add(this.from$.subscribe((from) => (this.from = from)));
    this.subscriptions.add(
      this.store.select(DashboardSelectors.selectedItemIds).subscribe((itemIds) => (this.selectedItemsIds = itemIds))
    );
  }

  openCreateObjectPanel($event: MouseEvent) {
    this.relation = { typeId: '', itemId: this.itemId ?? '' };
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['m-context-menu', 'create-object-panel'],
        backdropClass: 'backdrop'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe((_) => this.hide());
  }

  hide() {
    this.overlayRef?.dispose();
    this.closed.emit();
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
  }

  newObject() {
    return { id: uuidv4(), oClass: '', attributes: {}, metadata: {} };
  }

  get valid() {
    return (
      (!this.object || ItemUtils.isValidObject(this.tmpObject)) && (!this.link || (this.relation?.typeId ?? false))
    );
  }

  createObjects() {
    let relation = {
      from: this.selectedItemsIds,
      to: this.relation?.itemId ?? '',
      typeId: this.relation?.typeId ?? '',
      inversion: this.inversion
    };
    if (this.object) {
      this.tmpObject = ItemUtils.ensureItemIdHasCorrectFormat(this.tmpObject);
      this.store.dispatch(ItemActions.create({ item: this.tmpObject }));
      if (this.link) {
        relation.from = [this.tmpObject.id];
        this.store.dispatch(RelationTypesActions.createRelation(relation));
      }
    } else {
      this.store.dispatch(RelationTypesActions.createRelation(relation));
    }

    this.hide();
  }

  get attributes() {
    return this.classes.find((cl) => cl.id === this.tmpObject.oClass)?.attributes ?? [];
  }

  fieldType(attribute: Attribute) {
    return this.fields.find((field) => attribute.field === field.id)?.type;
  }

  assignValue(attribute: Attribute, $event: any) {
    const value =
      this.fieldType(attribute) === FieldType.INSTANT && $event !== '' ? new Date($event).getTime() : $event;
    if (!this.tmpObject.attributes[attribute.name]) {
      this.tmpObject.attributes[attribute.name] = { type: 'VALUE', metadata: {}, value, visible: true };
    } else {
      (this.tmpObject.attributes[attribute.name] as AttributeSimpleValue).value = value;
    }
  }

  value(attribute: Attribute) {
    const value = (this.tmpObject.attributes[attribute.name] as AttributeSimpleValue)?.value;
    if (this.fieldType(attribute) === FieldType.INSTANT) {
      return value !== undefined && value !== '' ? DateUtils.formatDate(new Date(value as string | number)) : undefined;
    }
    return ((this.tmpObject.attributes[attribute.name] as AttributeSimpleValue) ?? {}).value;
  }

  toggleDatePicker($event: Event, id: string) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.selectedDatePicker === id) {
      this.selectedDatePicker = '';
    } else {
      this.selectedDatePicker = id;
    }
  }

  closeDatePicker($event: Event) {
    if (!($event.currentTarget as HTMLElement).contains(($event as MouseEvent).relatedTarget as Node)) {
      this.selectedDatePicker = '';
    }
  }

  multiValues(attribute: Attribute) {
    return ((this.tmpObject.attributes[attribute.name] as AttributeMultipleValue) ?? { values: [] }).values;
  }

  removeMultiValued(attribute: Attribute, i: number) {
    (this.tmpObject.attributes[attribute.name] as AttributeMultipleValue).values.splice(i, 1);
  }

  addMultiValued(attribute: Attribute) {
    if (!this.tmpObject.attributes[attribute.name]) {
      this.tmpObject.attributes[attribute.name] = { type: 'MULTI', values: [] };
    }
    (this.tmpObject.attributes[attribute.name] as AttributeMultipleValue).values.push({
      type: 'VALUE',
      metadata: {},
      // @ts-ignore
      value: undefined,
      visible: true
    });
    return (this.tmpObject.attributes[attribute.name] as AttributeMultipleValue).values.length - 1;
  }

  valueMulti(attribute: Attribute, i: number) {
    return this.multiValues(attribute)[i].value;
  }

  assignValueMulti(attribute: Attribute, $event: any, i: number) {
    const value = this.fieldType(attribute) === FieldType.INSTANT ? new Date($event).getTime() : $event;
    if (!this.tmpObject.attributes[attribute.name]) {
      this.tmpObject.attributes[attribute.name] = { type: 'MULTI', values: [] };
    }
    if (!(this.tmpObject.attributes[attribute.name] as AttributeMultipleValue).values[i]) {
      (this.tmpObject.attributes[attribute.name] as AttributeMultipleValue).values[i] = {
        type: 'VALUE',
        metadata: {},
        value,
        visible: true
      };
    } else {
      (this.tmpObject.attributes[attribute.name] as AttributeMultipleValue).values[i].value = value;
    }
  }

  changeClass($event: any) {
    this.tmpObject = this.newObject();
    this.tmpObject.oClass = $event;
    if (this.from === 'map') {
      this.attributes.forEach((attribute) => {
        if (['latitude', 'lat'].indexOf(attribute.name) >= 0) {
          if (attribute.multiValued) {
            const idx = this.addMultiValued(attribute);
            this.assignValueMulti(attribute, (this.coordinates ?? [])[0], idx);
          } else {
            this.assignValue(attribute, (this.coordinates ?? [])[0]);
          }
        }
        if (['longitude', 'long', 'lon', 'lng'].indexOf(attribute.name) >= 0) {
          if (attribute.multiValued) {
            const idx = this.addMultiValued(attribute);
            this.assignValueMulti(attribute, (this.coordinates ?? [])[1], idx);
          } else {
            this.assignValue(attribute, (this.coordinates ?? [])[1]);
          }
        }
      });
    }
  }

  setRawMethod(attribute: Attribute, $event: any) {
    this.method = $event;
    if (!this.tmpObject.attributes[attribute.name]) {
      this.tmpObject.attributes[attribute.name] = {
        type: 'VALUE',
        metadata: {},
        value: '',
        visible: true
      };
    }
    if ($event === this.HTTP_ORIGIN_METHOD) {
      this.assignMetadata(attribute, '', HTTP_ORIGIN_METADATA);
    }
    if ($event === this.UPLOAD_METHOD) {
      // @ts-ignore
      delete (this.tmpObject.attributes[attribute.name] as AttributeSimpleValue).metadata[HTTP_ORIGIN_METADATA];
    }
  }

  valueMetadata(attribute: Attribute, type: string) {
    return (((this.tmpObject.attributes[attribute.name] as AttributeSimpleValue) ?? {}).metadata ?? {})[type];
  }

  assignMetadata(attribute: Attribute, $event: any, type: string) {
    if (!(this.tmpObject.attributes[attribute.name] as AttributeSimpleValue).metadata) {
      (this.tmpObject.attributes[attribute.name] as AttributeSimpleValue).metadata = { [type]: $event };
    } else {
      // @ts-ignore
      (this.tmpObject.attributes[attribute.name] as AttributeSimpleValue).metadata[type] = $event;
    }
  }

  toggleInversion() {
    this.inversion = !this.inversion;
  }
}
