import { ConnectedPosition } from '@angular/cdk/overlay';

export const POSITIONS: { [key: string]: ConnectedPosition } = {
  before: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
  after: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
  'start-top': { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  'start-bottom': { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
};
