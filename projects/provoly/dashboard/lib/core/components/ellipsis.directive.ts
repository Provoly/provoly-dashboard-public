import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ellipsis]'
})
export class EllipsisDirective implements AfterViewInit {
  @Input() textElementSelector!: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const element = this.elementRef.nativeElement;
    const child = this.elementRef.nativeElement.querySelector(this.textElementSelector);

    this.renderer.setStyle(child, 'overflow', 'hidden');
    this.renderer.setStyle(child, 'white-space', 'nowrap');
    this.renderer.setStyle(child, 'text-overflow', 'ellipsis');

    if (child && child.offsetWidth < child.scrollWidth) {
      this.renderer.addClass(element, 'a-tooltip');
      this.renderer.setAttribute(element, 'data-tooltip', child.innerHTML ?? element.innerHTML);
      this.renderer.setAttribute(element, 'data-tooltip-position', 'bottom');
    }
  }
}
