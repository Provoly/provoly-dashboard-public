export const notificationFeatureKey = '@pry/notification';

export interface PryNotification {
  id: string;
  text: { code: string; param?: { [key: string]: string }; title?: string };
  link?: string;
  creationDate: string;
}
