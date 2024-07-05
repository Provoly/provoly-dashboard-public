import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Class,
  ClassSelectors,
  Field,
  FieldSelectors,
  MapWidgetBubbleLayerOptions,
  MapWidgetGeometryLayerOptions,
  MapWidgetHeatMapLayerOptions,
  MapWidgetLayerOptions,
  MapWidgetMarkerLayerOptions
} from '@provoly/dashboard';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { WidgetMapUtils } from '../utils/widget-map.utils';

@Pipe({
  name: 'geometryFieldsFor'
})
export class GeometryFieldsForPipe implements PipeTransform {
  classes$: Observable<Class[]>;
  fields$: Observable<Field[]>;

  constructor(private store: Store<any>) {
    this.classes$ = this.store
      .select(ClassSelectors.classes)
      .pipe(map((classes) => classes.sort((a, b) => a.name.localeCompare(b.name))));
    this.fields$ = this.store.select(FieldSelectors.fields);
  }

  transform(value: MapWidgetLayerOptions, ...args: any[]): Observable<Attribute[]> {
    const specificLayer = value as
      | MapWidgetHeatMapLayerOptions
      | MapWidgetMarkerLayerOptions
      | MapWidgetBubbleLayerOptions
      | MapWidgetGeometryLayerOptions;

    const limitToClasses = args[0].classes as string[];
    const type = WidgetMapUtils.geometryForLayer({ type: args[0].type });

    return combineLatest([this.classes$, this.fields$]).pipe(
      filter(([classes, fields]) => !!classes && !!fields && classes.length > 0 && fields.length > 0),
      map(([classes, fields]) => {
        const potentialFields = classes
          .map((cl) => cl.id)
          .filter(
            (oClassId) =>
              !specificLayer.classes ||
              specificLayer.classes.length === 0 ||
              !!specificLayer.classes?.find((cl) => oClassId === cl)
          )
          .filter((classId) => !limitToClasses || limitToClasses.length === 0 || limitToClasses.includes(classId))
          .map((oClassId) => classes.find((cl) => cl.id === oClassId) ?? { attributes: [] as Attribute[] })
          .map((oClass) => oClass.attributes)
          .reduce((prev, curr) => [...prev, ...curr], [])
          .filter((attr) => attr.field.type === type)
          .sort((a, b) => a.technicalName.localeCompare(b.technicalName));

        const resArr = [] as Attribute[];
        potentialFields.forEach(function (attr) {
          if (resArr.findIndex((x) => x.technicalName == attr.technicalName) <= -1) {
            resArr.push(attr);
          }
        });
        return resArr;
      })
    );
  }
}
