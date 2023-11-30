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
        if (event.context instanceof CanvasRenderingContext2D) {
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
          this.clearCanvas(gl);
          gl.enable(gl.SCISSOR_TEST);
          gl.scissor(tl[0], tl[1], br[0] - tl[0], br[1] - tl[1]);
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
        gl.flush();
      }
    });
  }

  private clearCanvas(gl: WebGL2RenderingContext) {
    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);
    gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.6, 0, 0, 0.2);
    gl.clearDepth(1.0);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
  }
}
