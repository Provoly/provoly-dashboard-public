import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'pry-icon',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryIconComponent implements OnChanges {
  @HostBinding('style') baseStyle: SafeStyle;
  @Input() color: 'primary' | 'accent' | null = null;
  @Input() iconSvg?: string | null;
  @Input() animation = true;
  private _iconSvg?: string | null;

  get iconSvgUrl(): string | undefined {
    return this._iconSvgUrl;
  }

  private _iconSvgUrl?: string;

  @Input() iconImage?: string | null;
  private _iconImage?: string | null;

  get iconImageUrl(): string | undefined {
    return this._iconImageUrl;
  }

  private _iconImageUrl?: string;

  @Input() alt?: string = 'pry-icon';

  @Input() set width(val: number) {
    this._width = val;
    this.setHostStyles();
  }

  get width(): number {
    return this._width;
  }

  private _width = 24;

  @Input() set height(val: number) {
    this._height = val;
    this.setHostStyles();
  }

  get height(): number {
    return this._height;
  }

  private _height = 24;

  // set classes on icon for styling
  @Input() set classes(val: string) {
    this._classes = val;
  }

  get classes(): string {
    return this._classes;
  }

  private _classes = '';

  constructor(private sanitizer: DomSanitizer) {
    const safeStyle = `width: ${this._width}px; height: ${this._height}px;`;
    this.baseStyle = this.sanitizer.bypassSecurityTrustStyle(safeStyle);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const iconSvg = changes['iconSvg'];
    if (iconSvg) {
      this._iconSvg = iconSvg.currentValue;
    }
    const iconImage = changes['iconImage'];
    if (iconImage) {
      this._iconImage = iconImage?.currentValue;
    }
    if (this._iconSvg) {
      this._iconSvgUrl = `assets/svgs/${this._iconSvg}.svg`;
      this._iconImageUrl = undefined;
    } else if (this._iconImage) {
      this._iconImageUrl = `assets/images/${this._iconImage}`;
      this._iconSvgUrl = undefined;
    }
  }

  private setHostStyles(): void {
    const safeStyle = `width: ${this._width}px; height: ${this._height}px;`;
    this.baseStyle = this.sanitizer.bypassSecurityTrustStyle(safeStyle);
  }
}
