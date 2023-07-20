import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Output } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective {
  @Output()
  readonly resizable = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown').pipe(
    tap((e) => e.preventDefault()),
    switchMap(() => {
      const domRect = this.elementRef.nativeElement.closest('th')?.getBoundingClientRect();
      const width = domRect?.width ?? 0;
      const right = domRect?.right ?? 0;

      return fromEvent<MouseEvent>(this.documentRef, 'mousemove').pipe(
        map(({ clientX }) => width + clientX - right),
        distinctUntilChanged(),
        takeUntil(fromEvent(this.documentRef, 'mouseup'))
      );
    })
  );

  constructor(
    @Inject(DOCUMENT) private readonly documentRef: Document,
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}
}
