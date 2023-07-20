import { PRY_CUSTOMEVENT_TYPE, PrySnackMessage } from '@provoly/dashboard';
import { View } from 'vega';
import { ViewOptions } from 'vega-typings/types/runtime';
import { Runtime } from 'vega-typings/types/runtime/runtime';

let pryLogger = {
  ...console,
  debug: () => {},
  level: () => {},
  // @ts-ignore
  error: (err) => {
    // Making specific Vega error message trapping
    const customEvent = new CustomEvent<PrySnackMessage>(PRY_CUSTOMEVENT_TYPE, {
      detail: {
        type: 'error',
        message: '@pry.snack.default'
      },
      bubbles: true,
      cancelable: true
    });

    if (err.stack.includes('Error: missing:')) {
      customEvent.detail.message = '@pry.snack.missingParent';
    } else if (err.stack.includes("TypeError: Cannot read properties of undefined (reading 'value')")) {
      customEvent.detail.message = '@pry.snack.missingValue';
    } else if (err.stack.includes('Expected number')) {
      customEvent.detail.message = '@pry.snack.emptyValues';
    }

    document.dispatchEvent(customEvent);
  }
};

export class VegaErrorHandler extends View {
  constructor(runtime: Runtime, opt?: ViewOptions) {
    // @ts-ignore
    super(runtime, { ...opt, logger: pryLogger });
  }
}
