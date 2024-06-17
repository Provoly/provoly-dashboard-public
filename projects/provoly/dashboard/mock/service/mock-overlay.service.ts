import { Subject } from 'rxjs';

class MockOverlayGlobalPosition {
  centerHorizontally = () => this;
  centerVertically = () => this;
}

class MockOverlayPosition {
  globalPosition = new MockOverlayGlobalPosition();

  global(): any {
    return this.globalPosition;
  }

  flexibleConnectedTo = () => this;
  withPush = () => this;
  withPositions = () => this;
}

class MockScrollStrategyOptions {
  reposition = () => this;
}

export const mockOverlayRef = {
  backdropClick: () => new Subject<any>(),
  attach: () => ({
    instance: {},
    destroy: () => undefined
  }),
  dispose: () => undefined
};

export class MockOverlay {
  overlayPosition = new MockOverlayPosition();
  scrollStrategies = new MockScrollStrategyOptions();

  create(...args: any[]): any {
    return { ...mockOverlayRef };
  }

  position(): any {
    return this.overlayPosition;
  }
}
