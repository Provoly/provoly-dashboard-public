import { Component, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { DataWidgetComponent, TemplateWidgetOptions } from '@provoly/dashboard';
import { combineLatestWith, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'pry-widget-table',
  templateUrl: './widget-template.component.html'
})
export class WidgetTemplateComponent extends DataWidgetComponent {
  options$: Observable<TemplateWidgetOptions>;
  optionsCopy: TemplateWidgetOptions = {};
  template$: Observable<SafeHtml>;
  css$: Observable<SafeHtml>;
  id: number;
  static idGenerator = 0;

  constructor(store: Store<any>, el: ElementRef, private sanitizer: DomSanitizer) {
    super(store, el);
    this.id = WidgetTemplateComponent.idGenerator++;
    this.options$ = this.manifest$.pipe(map((manifest) => manifest.options as TemplateWidgetOptions));

    this.subscriptions.add(
      this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
        this.optionsCopy = { ...(JSON.parse(JSON.stringify(options)) as TemplateWidgetOptions) };
      })
    );

    this.template$ = this.options$.pipe(
      map((options) => (!!options.svg ? options.svg : options.html ?? '')),
      combineLatestWith(this.resultSet$),
      map(([template, rs]) => this.evaluate(template, rs))
    );

    this.css$ = this.options$.pipe(
      map((options) => `<style>${this.limitScope(options.css ?? '')}</style>`),
      combineLatestWith(this.resultSet$),
      map(([template, rs]) => this.evaluate(template, rs))
    );
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }

  evaluate(template: string, rs: any): SafeHtml {
    const regexp = new RegExp('{{(.*?)}}', 'g');
    const toReplace = template.match(regexp);
    let result = template;

    if (!!toReplace) {
      toReplace.forEach((extracted) => {
        const expr = extracted.substring(2, extracted.length - 2);
        const splitted = expr.split(/[.\]]/).filter((extr) => extr !== '');
        let evaluation: any = null;

        splitted.forEach((_splitPart) => {
          const splitPart = _splitPart.trim();
          if (splitPart.startsWith('rs')) {
            const classId = (expr.match(/rs\['(.)*?'/) ?? ['no-class-id-detected'])[0]
              .replace("rs['", '')
              .replace("'", '');
            evaluation = rs.items[classId];
          } else if (splitPart.startsWith('[')) {
            if (!!evaluation) {
              evaluation = evaluation[parseInt(splitPart.substring(1), 10)];
            }
          } else {
            if (!!evaluation) {
              const indexOfCaret = splitPart.indexOf('[');
              if (indexOfCaret === -1) {
                evaluation = evaluation[splitPart];
              } else {
                const prop = splitPart.substring(0, indexOfCaret);
                const subProp = splitPart.substring(indexOfCaret + 1);
                evaluation = evaluation[prop].values[subProp];
              }
              if (!!evaluation && evaluation.type === 'VALUE') {
                evaluation = evaluation.value;
              }
            }
          }
        });

        result = result.replace(extracted, evaluation);
      });
    }

    return this.sanitizer.bypassSecurityTrustHtml(result);
  }

  private limitScope(css: string): string {
    const scope = `.pry-template-${this.id}`;

    const scoped = css.replace(/([},] ?)/g, `$1${scope} `).replace(new RegExp(scope + ' $'), '');

    return scope + ' ' + scoped;
  }

  changeHtml($event: Event) {
    // @ts-ignore
    this.optionsCopy.html = $event.currentTarget.value;
  }

  changeCss($event: Event) {
    // @ts-ignore
    this.optionsCopy.html = $event.currentTarget.value;
  }
}
