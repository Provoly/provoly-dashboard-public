export type ControlMessageType = 'join' | 'leave';

export interface ControlMessage {
  type: ControlMessageType;
  sender: string;
  data: any;
}
