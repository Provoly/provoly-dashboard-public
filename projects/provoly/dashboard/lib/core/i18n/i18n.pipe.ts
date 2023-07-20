import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { PryI18nService } from './i18n.service';

@Pipe({
  name: 'i18n'
})
export class I18nPipe implements PipeTransform {
  value: string = '';
  key: string | null = null;
  params: any[] = [];
  waitSubscription?: Subscription;

  constructor(
    private translateService: PryI18nService,
    private _ref: ChangeDetectorRef
  ) {}

  transform(value: string, ...args: any[]): string {
    if (value === this.key && JSON.stringify(args) === JSON.stringify(this.params)) {
      return this.value;
    }
    this.key = value;
    this.params = args;

    this.value = this.translateService.instant(value, args[0] as { [key: string]: any });

    if (this.value === this.key) {
      // Not translated, maybe we must wait
      this.waitSubscription = this.translateService.get(value, args[0]).subscribe((value) => {
        if (value !== value) {
          this.value = value;
          this._ref.markForCheck();
          setTimeout(() => {
            this.waitSubscription?.unsubscribe();
          }, 10);
        }
      });
    }

    return this.value;
  }
}
