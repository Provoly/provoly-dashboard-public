import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pry-color-picker',
  templateUrl: './color-picker.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PryColorPickerComponent),
      multi: true
    }
  ]
})
export class PryColorPickerComponent implements ControlValueAccessor, AfterViewInit {
  onChange: any = () => {};
  onTouch: any = () => {};
  color? = '#000000';
  barColor: string = '#0000ff';
  disabled = false;
  inhibate = true;
  picking: boolean = false;

  @ViewChild('selector') selector!: ElementRef<HTMLCanvasElement>;
  selectorContext!: CanvasRenderingContext2D;
  @ViewChild('bar') bar!: ElementRef<HTMLCanvasElement>;
  barContext!: CanvasRenderingContext2D;
  markerSelectorPosition: [number, number] = [0, 0];
  markerBarPosition = 0;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  innerRadius = 3;
  outerRadius = 8;
  temporaryColor?: string;

  constructor(private _cd: ChangeDetectorRef) {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Define what should happen in this component, if something changes outside
  writeValue(color: string) {
    if (this.color !== color && !this.inhibate) {
      this.color = color;
      this.onChange(this.color);
      this.onTouch();
      this._cd.markForCheck();
      this.inputColor(color);
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._cd.markForCheck();
  }

  ngAfterViewInit(): void {
    this.inhibate = false;
    this.selectorContext = this.selector.nativeElement.getContext('2d', { willReadFrequently: true })!;
    this.barContext = this.bar.nativeElement.getContext('2d', { willReadFrequently: true })!;
  }

  togglePicker($event: MouseEvent) {
    this.picking = !this.disabled && !this.picking;
    if (!this.picking && this.temporaryColor) {
      this.writeValue(this.temporaryColor);
    }
    if (this.picking) {
      this.redrawSelector();
      this.redrawBar();
    }
  }

  redrawSelector() {
    this.selectorContext.clearRect(0, 0, this.selectorContext.canvas.width, this.selectorContext.canvas.height);
    this.drawColorGradient(this.selectorContext, false, ['#ffffff', this.barColor]);
    this.drawColorGradient(this.selectorContext, true, ['rgba(0,0,0,0)', '#000']);
    this.drawSelectorMarker();
  }

  redrawBar() {
    this.barContext.clearRect(0, 0, this.barContext.canvas.width, this.barContext.canvas.height);
    this.drawColorGradient(this.barContext, true, [
      '#FF0000',
      '#ffff00',
      '#00FF00',
      '#00FFFF',
      '#0000FF',
      '#FF00FF',
      '#FF0000'
    ]);
    this.drawBarMarker();
  }

  drawColorGradient(ctxt: CanvasRenderingContext2D, vertical = true, colors: string[]) {
    const gradientArgs: [number, number, number, number] = vertical
      ? [0, 0, 0, ctxt.canvas.height]
      : [0, 0, ctxt.canvas.width, 0];
    let gradient = ctxt.createLinearGradient(...gradientArgs);
    colors.forEach((color, idx) => {
      gradient.addColorStop(idx / (colors.length - 1), color);
    });
    ctxt.fillStyle = gradient;
    ctxt.fillRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
  }

  drawSelectorMarker() {
    const gradient = this.selectorContext.createRadialGradient(
      this.markerSelectorPosition[0],
      this.markerSelectorPosition[1],
      this.innerRadius,
      this.markerSelectorPosition[0],
      this.markerSelectorPosition[1],
      this.outerRadius
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, '#ffffff');

    this.selectorContext.beginPath();
    this.selectorContext.arc(
      this.markerSelectorPosition[0],
      this.markerSelectorPosition[1],
      this.outerRadius,
      0,
      2 * Math.PI
    );
    this.selectorContext.fillStyle = gradient;
    this.selectorContext.fill();
    this.selectorContext.stroke();
  }

  drawBarMarker() {
    this.barContext.strokeStyle = '2px solid black';
    this.barContext.beginPath();
    this.barContext.moveTo(0, this.markerBarPosition - this.innerRadius);
    this.barContext.lineTo(this.barContext.canvas.width, this.markerBarPosition - this.innerRadius);
    this.barContext.stroke();
    this.barContext.beginPath();
    this.barContext.moveTo(0, this.markerBarPosition + this.innerRadius);
    this.barContext.lineTo(this.barContext.canvas.width, this.markerBarPosition + this.innerRadius);
    this.barContext.stroke();
  }

  selectColor($event: MouseEvent, temporary = false) {
    // Read pixel Color
    const pixelColor = this.rgbToHex(
      ...(this.selectorContext.getImageData($event.offsetX, $event.offsetY, 1, 1)['data'] as unknown as [
        number,
        number,
        number
      ])
    );
    if (!temporary) {
      this.writeValue(pixelColor);
    } else {
      this.temporaryColor = pixelColor;
    }

    this.markerSelectorPosition = [$event.offsetX, $event.offsetY];
    this.redrawSelector();
    $event.stopPropagation();
  }

  selectColorFromBar($event: MouseEvent) {
    this.markerBarPosition = $event.offsetY;
    this.barColor = this.rgbToHex(
      ...(this.barContext.getImageData(20, $event.offsetY, 1, 1)['data'] as unknown as [number, number, number])
    );
    this.redrawBar();
    this.redrawSelector();
    this.selectColor(
      {
        offsetX: this.markerSelectorPosition[0],
        offsetY: this.markerSelectorPosition[1],
        stopPropagation: () => $event.stopPropagation()
      } as unknown as MouseEvent,
      true
    );
    $event.stopPropagation();
  }

  componentToHex(c: number) {
    return c.toString(16).padStart(2, '0');
  }

  rgbToHex(r: number, g: number, b: number) {
    return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  clickInput($event: MouseEvent) {
    this.input.nativeElement.focus();
    $event.stopPropagation();
  }

  inputColor($event: any) {
    const possibleColor = !!$event ? ($event.indexOf('#') === -1 ? '#' + $event : $event) : '#40B688';
    if (/^#[0-9A-F]{6}$/i.test(possibleColor)) {
      this.writeValue(possibleColor);
      const rgba = this.strToRGBA(this.color!);
      const hsva = this.RGBAtoHSVA(rgba);
      this.markerBarPosition = (this.barContext.canvas.height * hsva.h) / 360;
      this.markerSelectorPosition = [
        (this.selectorContext.canvas.width * hsva.s) / 100,
        this.selectorContext.canvas.height * (1 - hsva.v / 100)
      ];
      this.barColor = this.hslToHex(hsva.h, 100, 50);
      this.redrawBar();
      this.redrawSelector();
    }
  }

  strToRGBA(str: string) {
    const regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;
    let match, rgba;

    // Default to black for invalid color strings
    this.selectorContext.fillStyle = '#000';

    // Use canvas to convert the string to a valid color string
    this.selectorContext.fillStyle = str;
    match = regex.exec(this.selectorContext.fillStyle);

    if (match) {
      rgba = {
        // @ts-ignore
        r: match[3] * 1,
        // @ts-ignore
        g: match[4] * 1,
        // @ts-ignore
        b: match[5] * 1,
        // @ts-ignore
        a: match[6] * 1
      };

      // Workaround to mitigate a Chromium bug where the alpha value is rounded incorrectly
      rgba.a = +rgba.a.toFixed(2);
    } else {
      match = this.selectorContext.fillStyle
        .replace('#', '')
        .match(/.{2}/g)!
        .map((h) => parseInt(h, 16));
      rgba = {
        r: match[0],
        g: match[1],
        b: match[2],
        a: 1
      };
    }

    return rgba;
  }

  RGBAtoHSVA(rgba: any) {
    const red = rgba.r / 255;
    const green = rgba.g / 255;
    const blue = rgba.b / 255;
    const xmax = Math.max(red, green, blue);
    const xmin = Math.min(red, green, blue);
    const chroma = xmax - xmin;
    const value = xmax;
    let hue = 0;
    let saturation = 0;

    if (chroma) {
      if (xmax === red) {
        hue = (green - blue) / chroma;
      }
      if (xmax === green) {
        hue = 2 + (blue - red) / chroma;
      }
      if (xmax === blue) {
        hue = 4 + (red - green) / chroma;
      }
      if (xmax) {
        saturation = chroma / xmax;
      }
    }

    hue = Math.floor(hue * 60);

    return {
      h: hue < 0 ? hue + 360 : hue,
      s: Math.round(saturation * 100),
      v: Math.round(value * 100),
      a: rgba.a
    };
  }

  hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    // Having obtained RGB, convert channels to hex
    // @ts-ignore
    r = Math.round((r + m) * 255).toString(16);
    // @ts-ignore
    g = Math.round((g + m) * 255).toString(16);
    // @ts-ignore
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    // @ts-ignore
    if (r.length == 1) r = '0' + r;
    // @ts-ignore
    if (g.length == 1) g = '0' + g;
    // @ts-ignore
    if (b.length == 1) b = '0' + b;

    return '#' + r + g + b;
  }

  mouseMove($event: MouseEvent) {
    if ($event.buttons > 0) {
      this.selectColor($event, true);
    }
  }

  mouseUp($event: MouseEvent) {
    this.selectColor($event, false);
  }
}
