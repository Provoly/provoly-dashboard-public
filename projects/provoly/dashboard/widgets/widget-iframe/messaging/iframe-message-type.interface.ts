export interface PryIframeMessageType extends MessageEvent {
  data: {
    request: string;
    source: '@pry' | undefined;
    target: '@pry' | undefined;
  };
  relatedWindow: Window;
}
