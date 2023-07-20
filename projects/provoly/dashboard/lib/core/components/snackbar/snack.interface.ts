export interface PrySnackMessage {
  message: string;
  action?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timeout?: number;
}
