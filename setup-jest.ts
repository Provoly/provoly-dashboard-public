import 'jest-marbles';
import 'jest-preset-angular/setup-jest';

class BroadcastChannelMock {
  postMessage() {}
}

Object.defineProperty(window, 'BroadcastChannel', { value: BroadcastChannelMock });

Object.defineProperty(window, 'DragEvent', {
  value: class DragEvent {}
});

Object.defineProperty(window, 'DataTransfer', {
  value: class DataTransfer {}
});

Object.defineProperty(window, 'ResizeObserver', {
  value: jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn()
  }))
});

jest.retryTimes(2, { logErrorsBeforeRetry: true });
