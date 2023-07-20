import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { PrySortChange } from '../sort.model';

@Component({
  selector: 'th[prySortHeader]',
  templateUrl: './sort-header.component.html'
})
export class PrySortHeaderComponent implements AfterViewInit {
  @Input() prySortHeader!: string;
  prySortActive = false;
  prySortDirection?: 'asc' | 'desc';
  @Output() sortChange = new EventEmitter<PrySortChange>();

  constructor(
    private _elRef: ElementRef,
    private _renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    if (this.prySortActive) {
      if (this.prySortDirection === 'asc') {
        this._renderer.setAttribute(this._elRef.nativeElement, 'aria-sort', 'ascending');
      } else {
        this._renderer.setAttribute(this._elRef.nativeElement, 'aria-sort', 'descending');
      }
    } else {
      this._renderer.removeAttribute(this._elRef.nativeElement, 'aria-sort');
    }
  }

  onChangeSort(): void {
    // if no current sort then active asc
    if (!this.prySortActive) {
      this.sortChange.emit({ active: this.prySortHeader, direction: 'asc' });
      this._renderer.setAttribute(this._elRef.nativeElement, 'aria-sort', 'ascending');
    }
    // if there is current asc sort then active desc
    else if (this.prySortActive && this.prySortDirection === 'asc') {
      this.sortChange.emit({ active: this.prySortHeader, direction: 'desc' });
      this._renderer.setAttribute(this._elRef.nativeElement, 'aria-sort', 'descending');
    }
    // else there is current desc sort then desactive sort
    else {
      this.sortChange.emit({});
      this._renderer.removeAttribute(this._elRef.nativeElement, 'aria-sort');
    }
  }
}
