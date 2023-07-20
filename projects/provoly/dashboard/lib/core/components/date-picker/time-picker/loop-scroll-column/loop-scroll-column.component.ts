import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'loop-scroll-column',
  templateUrl: './loop-scroll-column.component.html'
})
export class LoopScrollColumnComponent implements AfterViewInit, OnChanges {
  LOOP_COUNTER = [0, 1];
  @ViewChild('column') column?: ElementRef;
  @Input() list: any;
  @Input() selectedItem: any;
  @Output() selection = new EventEmitter<any>();

  clones: any = [];
  disableScroll = false;
  scrollHeight = 0;
  scrollPos = 0;
  clonesHeight = 0;

  constructor() {
    this.reCalc();
  }

  ngAfterViewInit(): void {
    this.clones = this.column?.nativeElement.querySelectorAll('.is-clone') ?? [];
    this.reCalc();
    this.column?.nativeElement.querySelector('.-selected')?.scrollIntoView();
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      this.column?.nativeElement.querySelector('.-selected')?.scrollIntoView({ block: 'center' });
    }, 0);
  }

  select(item: any) {
    this.selectedItem = item;
    this.selection.emit(item);
  }

  getScrollPos() {
    return this.column?.nativeElement.scrollTop ?? 0;
  }

  setScrollPos(pos: number) {
    if (this.column) {
      this.column.nativeElement.scrollTop = pos;
    }
  }

  getClonesHeight() {
    this.clonesHeight = 0;
    for (let i = 0; i < this.clones.length; i += 1) {
      this.clonesHeight += (this.clones[i] as HTMLElement).offsetHeight;
    }
    return this.clonesHeight;
  }

  reCalc() {
    this.scrollPos = this.getScrollPos();
    this.scrollHeight = this.column?.nativeElement.scrollHeight || 0;
    this.clonesHeight = this.getClonesHeight();

    if (this.scrollPos <= 0) {
      this.setScrollPos(1); // Scroll 1 pixel to allow upwards scrolling
    }
  }

  onScroll() {
    window.requestAnimationFrame(() => this.scrollUpdate());
  }

  scrollUpdate() {
    if (!this.disableScroll) {
      this.scrollPos = this.getScrollPos();

      if (this.clonesHeight + this.scrollPos >= this.scrollHeight) {
        // Scroll to the top when you’ve reached the bottom
        this.setScrollPos(1); // Scroll down 1 pixel to allow upwards scrolling
        this.disableScroll = true;
      } else if (this.scrollPos <= 0) {
        // Scroll to the bottom when you reach the top
        this.setScrollPos(this.scrollHeight - this.clonesHeight);
        this.disableScroll = true;
      }
    }

    if (this.disableScroll) {
      // Disable scroll-jumping for a short time to avoid flickering
      window.setTimeout(() => {
        this.disableScroll = false;
      }, 40);
    }
  }
}
