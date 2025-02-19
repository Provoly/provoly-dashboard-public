import { Component, ElementRef, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { DataWidgetComponent, TemplateWidgetOptions } from '@provoly/dashboard';
import { combineLatestWith, filter, map, Observable } from 'rxjs';

@Component({
  selector: 'pry-widget-template',
  templateUrl: './widget-template.component.html'
})
export class WidgetTemplateComponent extends DataWidgetComponent {
  options$: Observable<TemplateWidgetOptions>;
  optionsCopy: TemplateWidgetOptions = {};
  template$: Observable<SafeHtml>;
  css$: Observable<SafeHtml>;
  id: number;
  static idGenerator = 0;

  constructor(
    store: Store<any>,
    el: ElementRef,
    private sanitizer: DomSanitizer
  ) {
    super(store, el);
    this.id = WidgetTemplateComponent.idGenerator++;
    this.options$ = this.manifest$.pipe(map((manifest) => manifest.options as TemplateWidgetOptions));

    this.subscriptions.add(
      this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
        this.optionsCopy = { ...(structuredClone(options) as TemplateWidgetOptions) };
      })
    );

    this.template$ = this.options$.pipe(
      map((options) => (!!options.svg ? options.svg : options.html ?? '')),
      combineLatestWith(this.resultSet$),
      map(
        ([template, rs]) =>
          this.sanitizer.sanitize(SecurityContext.HTML, WidgetTemplateComponent.evaluate(template, rs)) ?? ''
      )
    );

    this.css$ = this.options$.pipe(
      map((options) => `<style>${WidgetTemplateComponent.limitScope(options.css ?? '', this.id + '')}</style>`),
      combineLatestWith(this.resultSet$),
      map(
        ([template, rs]) => this.sanitizer.bypassSecurityTrustHtml(WidgetTemplateComponent.evaluate(template, rs)) ?? ''
      )
    );
  }

  override emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }

  static evaluate(template: string, rs: any): string {
    const regexp = new RegExp('{{(.*?)}}', 'g');
    const toReplace = template.match(regexp);
    let result = template;

    if (!!toReplace) {
      toReplace.forEach((extracted) => {
        const expr = extracted.substring(2, extracted.length - 2).trim();
        let evaluation: any = null;

        try {
          // Replace rs references with actual values from the rs object
          const replacedExpr = expr.replace(/rs\['(.*?)'\]\[(.*?)\]\.attributes\.(\w+)/g, (match, p1, p2, p3) => {
            if (p2.startsWith('id=')) {
              const id = p2.split('=')[1].replace(/['"]/g, '');
              const item = rs.items[p1].find((item: any) => item.id === id);
              return item ? item.attributes[p3].value : '';
            } else if (p2.includes('=')) {
              const conditions = p2.split('&').map((cond: any) => cond.split('='));
              const item = rs.items[p1].find((item: any) =>
                conditions.every(
                  ([attr, value]: [any, any]) => item.attributes[attr].value == value.replace(/['"]/g, '')
                )
              );
              return item ? item.attributes[p3].value : '';
            } else {
              return rs.items[p1][parseInt(p2, 10)].attributes[p3].value;
            }
          });

          // Evaluate the arithmetic expression
          try {
            evaluation = new Function('return ' + replacedExpr)();
          } catch (error) {
            evaluation = replacedExpr;
          }
        } catch (error) {
          console.error('Error evaluating expression:', expr, error);
        }

        result = result.replace(extracted, evaluation);
      });
    }

    return result;
  }

  static limitScope(css: string, id: string): string {
    const scope = `.pry-template-${id}`;

    const scoped = css.replace(/([},] ?)/g, `$1${scope} `).replace(new RegExp(scope + ' $'), '');

    return scope + ' ' + scoped;
  }

  changeHtml($event: Event) {
    // @ts-ignore
    this.optionsCopy.html = $event.currentTarget.value;
  }

  changeCss($event: Event) {
    // @ts-ignore
    this.optionsCopy.css = $event.currentTarget.value;
  }
}
