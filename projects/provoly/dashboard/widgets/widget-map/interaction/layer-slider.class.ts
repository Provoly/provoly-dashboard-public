import { Map } from 'ol';
import RenderEvent from 'ol/render/Event';
import { getRenderPixel } from 'ol/render';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { Heatmap } from 'ol/layer';

export class LayerSlider {
  map!: Map;
  slider!: HTMLInputElement;

  init(map: Map, slider: HTMLInputElement) {
    this.map = map;
    this.slider = slider;
    return this;
  }

  applySlide(type: 'left' | 'right' | 'all', layer: TileLayer<any> | VectorLayer<any> | Heatmap) {
    layer.on('prerender', (event: RenderEvent) => {
      const mapSize = this.map.getSize();
      if (mapSize) {
        if (event.context instanceof CanvasRenderingContext2D) {
          const width = mapSize[0] * (parseFloat(this.slider.value) / 100);
          let tl = getRenderPixel(event, [0, 0]);
          let tr = getRenderPixel(event, [width, 0]);
          let bl = getRenderPixel(event, [0, mapSize[1]]);
          let br = getRenderPixel(event, [width, mapSize[1]]);
          if (type === 'right') {
            tl = getRenderPixel(event, [width, 0]);
            tr = getRenderPixel(event, [mapSize[0], 0]);
            bl = getRenderPixel(event, [width, mapSize[1]]);
            br = getRenderPixel(event, mapSize);
          }
          const ctx = event.context as CanvasRenderingContext2D;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tl[0], tl[1]);
          ctx.lineTo(bl[0], bl[1]);
          ctx.lineTo(br[0], br[1]);
          ctx.lineTo(tr[0], tr[1]);
          ctx.closePath();
          ctx.clip();
        } else {
          const gl = event.context as unknown as WebGL2RenderingContext;
          const bottomLeft = getRenderPixel(event, [0, mapSize[1]]);
          const topRight = getRenderPixel(event, [mapSize[0], 0]);
          const leftWidth = (topRight[0] - bottomLeft[0]) * (parseFloat(this.slider.value) / 100);
          const rightWidth = (topRight[0] - bottomLeft[0]) * (1 - parseFloat(this.slider.value) / 100);
          const height = topRight[1] - bottomLeft[1];
          gl.enable(gl.SCISSOR_TEST);
          if (type === 'right') {
            gl.scissor(bottomLeft[0] + leftWidth, bottomLeft[1], rightWidth, height);
          } else {
            gl.scissor(bottomLeft[0], bottomLeft[1], leftWidth, height);
          }
        }
      }
    });
    layer.on('postrender', (event) => {
      if (event.context instanceof CanvasRenderingContext2D) {
        const ctx = event.context as CanvasRenderingContext2D;
        ctx.restore();
      } else {
        const gl = event.context as WebGL2RenderingContext;
        gl.disable(gl.SCISSOR_TEST);
      }
    });
  }
}
