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
}

export class MockOverlay {
  overlayPosition = new MockOverlayPosition();

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
