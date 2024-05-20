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
  IconOptions,
  IconPosition,
  IconRule
} from '../store/config/icon-definitions.interface';
import { ImageService, INTERNALLY_STORED_IMAGE_PREFIX } from '../store/image/image.service';

const defaultImage = new Image();
defaultImage.src = DEFAULT_ICON_URL;

const SUB_ICON_SIZE_PERCENT = 0.25;

export interface ImageCache {
  [classId: string]: {
    ruleSignature: string;
    images: {
      [rulesMatch: string]: Promise<HTMLCanvasElement>;
    };
    borderedImages: {
      [rulesMatch: string]: Promise<HTMLCanvasElement>;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class SymbolService {
  private definitions: IconDefinitions = {};
  private classes: Class[] = [];
  private imageCache: ImageCache = {};

  constructor(private store: Store<any>, private sanitizer: DomSanitizer, private imageService: ImageService) {
    this.store.select(ClassSelectors.classes).subscribe((classes) => (this.classes = classes));
    this.store.select(ConfigSelectors.iconDefinitions).subscribe((defs) => {
      this.definitions = defs;

      // For each class, generate all icons for ruleset
      Object.keys(this.definitions).forEach((classId) => {
        if (!this.imageCache[classId]) {
          this.imageCache[classId] = { images: {}, borderedImages: {}, ruleSignature: '--init--' };
        }
        if (
          !this.imageCache[classId] ||
          this.imageCache[classId].ruleSignature !== JSON.stringify(this.definitions[classId])
        ) {
          this.imageCache[classId].ruleSignature = JSON.stringify(this.definitions[classId]);
          this.imageCache[classId].images = this.generateAllRulesCombinaisonImages(this.definitions[classId]);
          this.imageCache[classId].borderedImages = this.generateAllRulesCombinaisonImages(
            this.definitions[classId],
            '#8cd560'
          );
        }
      });
    });
  }

  private generateAllRulesCombinaisonImages(definition: IconOptions[], borderColor?: string) {
    return this.recursiveRuleMatches(definition)
      .map((ruleMatch) => ({ [ruleMatch]: this.generateImageForRuleMatch(ruleMatch, definition, borderColor) }))
      .reduce((p, c) => ({ ...p, ...c }), {});
  }

  recursiveRuleMatches(definition: IconOptions[]): string[] {
    const [rule, ...otherRules] = definition;
    if (!rule) {
      return [''];
    }
    return this.recursiveRuleMatches(otherRules)
      .map((rule: string) => ['0' + rule, '1' + rule])
      .flat();
  }

  private generateImageForRuleMatch(
    ruleMatch: string,
    definition: IconOptions[],
    borderColor?: string
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') ?? (null as unknown as CanvasRenderingContext2D);

    let applicableRules = definition.filter((_, idx) => ruleMatch[idx] === '1');
    if (applicableRules.length === 0) {
      // If no rule match, then apply default rule only
      applicableRules = definition.filter((def) => !!def.isDefault);
    }

    const promiseImages = Promise.all(applicableRules.map((rule) => this.downloadImage(rule.iconUrl)));

    return new Promise((resolve, reject) => {
      promiseImages
        .then((images) => {
          canvas.width = 600;
          canvas.height = 600;
          const subSize = {
            width: 600 * SUB_ICON_SIZE_PERCENT,
            height: 600 * SUB_ICON_SIZE_PERCENT,
            offsetToRight: 600 * (1 - SUB_ICON_SIZE_PERCENT),
            offsetToBottom: 600 * (1 - SUB_ICON_SIZE_PERCENT)
          };

          // Then draw everything
          applicableRules.forEach((def, idx, arr) => {
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
        })
        .catch((err) => reject(err));
    });
  }

  getSymbol(item: Item, bordered?: boolean): Promise<HTMLCanvasElement> {
    // First, we try to apply non-default rules
    let ruleMatch = (this.definitions[item.oClass] ?? this.definitions['default'])
      .map((def) => (this.matchRule(item, def.rule) && !def.isDefault ? '1' : '0'))
      .join('');

    const imageSet = this.imageCache[item.oClass] ?? this.imageCache['default'];

    return imageSet[bordered ? 'borderedImages' : 'images'][ruleMatch];
  }

  getSymbolOfClass(id: string, noDefault = false): Promise<SafeUrl | null> {
    const definitionsForClass = (this.definitions[id] || []).find((def) => def.isDefault);
    const url = definitionsForClass?.iconUrl ?? DEFAULT_ICON_URL;
    if (url === DEFAULT_ICON_URL && noDefault) {
      return Promise.resolve(null);
    }
    return this.downloadAsUrl(url);
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

  getSymbolAsIconStyle(item: Item, bordered?: boolean): Promise<Style> {
    return new Promise<Style>((resolve, reject) => {
      this.getSymbol(item, bordered)
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
    if (url in this.cache) return this.cache[url];

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

      const regexp = new RegExp('^' + INTERNALLY_STORED_IMAGE_PREFIX);
      this.imageService
        .getImage(url.replace(regexp, ''), !url.startsWith(INTERNALLY_STORED_IMAGE_PREFIX))
        .subscribe((res) => {
          image.src = this.sanitizer.sanitize(SecurityContext.URL, res.url) ?? DEFAULT_ICON_URL;
        });
    });

    return this.cache[url];
  }

  private matchRule(item: Item, rule?: IconRule) {
    if (!rule) {
      return true;
    }
    if (rule.attributeName in item.attributes) {
      if (item.attributes[rule.attributeName].type === 'MULTI') {
        // multi valued
        return (item.attributes[rule.attributeName] as AttributeMultipleValue).values
          .map((attrValue) => compareOperationFunctions[rule.operation](attrValue.value, rule.value))
          .reduce((p, c) => c || p, false);
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
