import { of, Subject } from 'rxjs';

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

export class MockOverlay {
  overlayPosition = new MockOverlayPosition();
  scrollStrategies = new MockScrollStrategyOptions();

  create(...args: any[]): any {
    return {
      backdropClick: () => new Subject().asObservable(),
      attach: () => undefined,
      dispose: () => undefined
    };
  }

  position(): any {
    return this.overlayPosition;
  }
}

export const mockOverlayRef = {
  backdropClick: () => of({}),
  attach: () => undefined,
  dispose: () => undefined
};
