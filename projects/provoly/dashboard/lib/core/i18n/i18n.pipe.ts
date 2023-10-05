import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { PryI18nService } from './i18n.service';

@Pipe({
  name: 'i18n',
  pure: false
})
export class I18nPipe implements PipeTransform, OnDestroy {
  value: string = '';
  key: string | null = null;
  params: any[] = [];
  waitSubscription?: Subscription;
  private _ref: ChangeDetectorRef | null;

  constructor(private translateService: PryI18nService, _ref: ChangeDetectorRef) {
    this._ref = _ref;
  }

  transform(value: string, ...args: any[]): string {
    const warn = (args[0] ?? { warn: true }).warn;

    if (value === this.key && JSON.stringify(args) === JSON.stringify(this.params)) {
      return this.value;
    }
    this.key = value;
    this.params = args;

    this.value = this.translateService.instant(value, args[0] as { [key: string]: any }, warn);

    if (this.value === this.key) {
      // Not translated, maybe we must wait
      this.waitSubscription = this.translateService.get(value, args[0], warn).subscribe((value) => {
        if (this.value !== value) {
          this.value = value;
          this._ref!.markForCheck();
          this.dispose();
        }
      });
    }

    return this.value;
  }

  dispose() {
    setTimeout(() => {
      this.waitSubscription?.unsubscribe();
      this._ref = null;
    }, 10);
  }

  ngOnDestroy(): void {
    this.dispose();
  }
}
