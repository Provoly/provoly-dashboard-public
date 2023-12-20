import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClassSelectors, FieldSelectors, FieldType, Item, ItemUtils } from '@provoly/dashboard';
import { combineLatestWith } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Pipe({ name: 'getValue' })
export class GetValuePipe implements PipeTransform {
  constructor(private store: Store<any>) {}

  transform(value: Item, ...args: any[]): any {
    return this.store.select(ClassSelectors.classes).pipe(
      combineLatestWith(this.store.select(FieldSelectors.fields)),
      filter(([classes, fields]) => !!classes && classes.length > 0),
      map(([classes, fields]) => {
        const oClass = classes.find((cl) => cl.id === value.oClass);
        const attribute = oClass?.attributes.find((attr) => attr.technicalName === args[0]);
        if (!!attribute) {
          const field = fields.find((f) => f.id === attribute.field);
          if (
            field &&
            [
              FieldType.POINT,
              FieldType.MULTIPOINT,
              FieldType.LINE,
              FieldType.MULTILINE,
              FieldType.MULTILINE,
              FieldType.POLYGON,
              FieldType.MULTIPOLYGON
            ].includes(field.type)
          ) {
            // @ts-ignore
            const coordinates = JSON.stringify(ItemUtils.getAttributeCalculatedValue(value, attribute)?.coordinates);
            return coordinates && coordinates.length > 40 ? `${coordinates.substring(0, 40)}...` : coordinates;
          }
          return ItemUtils.getAttributeCalculatedValue(value, attribute);
        }
        return ItemUtils.getAttributeCalculatedValue(value, args[0]);
      })
    );
  }
}
