import { HttpClient } from '@angular/common/http';
import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Icon, Style } from 'ol/style';
import { AttributeMultipleValue, AttributeSimpleValue, Item } from '../model/item.interface';
import { Class } from '../store/class/class.interface';
import { ClassSelectors } from '../store/class/class.selectors';
import { ConfigSelectors } from '../store/config/config.selectors';
import {
  compareOperationFunctions,
  DEFAULT_ICON_URL,
  IconDefinitions,
  IconPosition,
  IconRule
} from '../store/config/icon-definitions.interface';
import { ImageService, INTERNALLY_STORED_IMAGE_PREFIX } from '../store/image/image.service';

const defaultImage = new Image();
defaultImage.src = DEFAULT_ICON_URL;

const SUB_ICON_SIZE_PERCENT = 0.25;

@Injectable({
  providedIn: 'root'
})
export class SymbolService {
  private definitions: IconDefinitions = {};

  private classes: Class[] = [];

  constructor(
    private httpClient: HttpClient,
    private store: Store<any>,
    private sanitizer: DomSanitizer,
    private imageService: ImageService
  ) {
    this.store.select(ConfigSelectors.iconDefinitions).subscribe((defs) => (this.definitions = defs));
    this.store.select(ClassSelectors.classes).subscribe((classes) => (this.classes = classes));
  }

  getSymbol(item: Item, borderColor?: string): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') ?? (null as unknown as CanvasRenderingContext2D);

    return new Promise((resolve, reject) => {
      // First, we try to apply non-default rules
      let appliableRules = (this.definitions[item.oClass] ?? this.definitions['default']).filter(
        (def) => this.matchRule(item, def.rule) && !def.isDefault
      );

      if (appliableRules.length === 0) {
        // If no rule match, then apply default rule
        appliableRules = (this.definitions[item.oClass] ?? this.definitions['default']).filter(
          (def) => !!def.isDefault
        );
      }

      const promiseImages = Promise.all(appliableRules.map((rule) => this.downloadImage(rule.iconUrl)));

      promiseImages.then((images) => {
        canvas.width = 600;
        canvas.height = 600;
        const subSize = {
          width: 600 * SUB_ICON_SIZE_PERCENT,
          height: 600 * SUB_ICON_SIZE_PERCENT,
          offsetToRight: 600 * (1 - SUB_ICON_SIZE_PERCENT),
          offsetToBottom: 600 * (1 - SUB_ICON_SIZE_PERCENT)
        };

        // Then draw everything
        appliableRules.forEach((def, idx, arr) => {
          const image = images[idx];
          switch (def.position) {
            case IconPosition.BOTTOM_RIGHT:
              ctx.globalCompositeOperation = 'source-over';
              ctx.drawImage(image, subSize.offsetToRight, subSize.offsetToBottom, subSize.width, subSize.height);
              break;
            case IconPosition.BOTTOM_LEFT:
              ctx.globalCompositeOperation = 'source-over';
              ctx.drawImage(image, 0, subSize.offsetToBottom, subSize.width, subSize.height);
              break;
            case IconPosition.TOP_RIGHT:
              ctx.globalCompositeOperation = 'source-over';
              ctx.drawImage(image, subSize.offsetToRight, 0, subSize.width, subSize.height);
              break;
            case IconPosition.TOP_LEFT:
              ctx.globalCompositeOperation = 'source-over';
              ctx.drawImage(image, 0, 0, subSize.width, subSize.height);
              break;
            case IconPosition.FULL:
            default:
              if (!borderColor) {
                // draw original image in normal mode
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(image, 0, 0, 600, 600);
              } else {
                let i = 0;
                const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1]; // final y position
                const strokeWidth = Math.round(600 * 0.05); // border width: 5% of image width
                // draw images at offsets from the array scaled by s
                for (; i < dArr.length; i += 2) {
                  ctx.drawImage(
                    image,
                    strokeWidth + dArr[i] * strokeWidth,
                    strokeWidth + dArr[i + 1] * strokeWidth,
                    600,
                    600
                  );
                }

                // fill with color
                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = borderColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // draw original image in normal mode
                ctx.globalCompositeOperation = 'source-over';
                ctx.drawImage(image, strokeWidth, strokeWidth, 600, 600);
              }
          }
        });

        resolve(canvas);
      });
    });
  }

  getSymbolOfClass(id: string): Promise<SafeUrl> {
    const definitionsForClass = (this.definitions[id] || []).find((def) => def.isDefault);
    return this.downloadAsUrl(definitionsForClass?.iconUrl ?? DEFAULT_ICON_URL);
  }

  downloadAsUrl(url: string): Promise<string> {
    return new Promise((resolve) => {
      this.downloadImage((!url ? null : url) ?? DEFAULT_ICON_URL).then((image) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') ?? (null as unknown as CanvasRenderingContext2D);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, 0, 0, image.width, image.height);
        resolve(canvas.toDataURL('image/png'));
      });
    });
  }

  getSymbolAsIconStyle(item: Item, borderColor?: string): Promise<Style> {
    return new Promise<Style>((resolve, reject) => {
      this.getSymbol(item, borderColor)
        .then((canvas) => {
          const size = (this.definitions[item.oClass] ?? this.definitions['default'])[0].iconSize;
          const scale = [size[0] / canvas.width, size[1] / canvas.height];

          resolve(
            new Style({
              image: new Icon({
                img: canvas,
                imgSize: [canvas.width, canvas.height],
                scale
              })
            })
          );
        })
        .catch((err) => console.error(err));
    });
  }

  cache: { [url: string]: Promise<HTMLImageElement> } = {};

  downloadImage(url: string): Promise<HTMLImageElement> {
    if (!!this.cache[url]) return this.cache[url];

    this.cache[url] = new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onerror = () => {
        console.error('error with image', url);
        resolve(defaultImage);
      };
      image.onload = () => {
        resolve(image);
      };

      if (url.startsWith(INTERNALLY_STORED_IMAGE_PREFIX)) {
        const regexp = new RegExp('^' + INTERNALLY_STORED_IMAGE_PREFIX);
        this.imageService.getImage(url.replace(regexp, '')).subscribe((res) => {
          image.src = this.sanitizer.sanitize(SecurityContext.URL, res.url) ?? DEFAULT_ICON_URL;
        });
      } else {
        image.src = this.sanitizer.sanitize(SecurityContext.URL, url) ?? DEFAULT_ICON_URL;
      }
    });

    return this.cache[url];
  }

  private matchRule(item: Item, rule?: IconRule) {
    if (!rule) {
      return true;
    }
    if (!!item.attributes[rule.attributeName]) {
      if (item.attributes[rule.attributeName].type === 'MULTI') {
        // multi valued
        return (item.attributes[rule.attributeName] as AttributeMultipleValue).values
          .map((attrValue) => compareOperationFunctions[rule.operation](attrValue.value, rule.value))
          .reduce((p, c) => c || p);
      } else {
        // single valued
        return compareOperationFunctions[rule.operation](
          (item.attributes[rule.attributeName] as AttributeSimpleValue).value,
          rule.value
        );
      }
    }
    return false;
  }
}
