import {
  AfterViewChecked,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

@Directive({
  selector: '[detachRow]'
})
export class DetachRowDirective implements AfterViewChecked {
  @HostListener('click', ['$event']) clickEvt($event: MouseEvent): any {
    this.cdr.reattach();
    this.selectedValue.emit($event);
  }

  @Output() selectedValue: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    this.cdr.detach();
  }
}
