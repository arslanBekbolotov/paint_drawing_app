import { WebSocket } from "ws";

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IPayload {
  x: number;
  y: number;
  color: string;
}

export interface IncomingMessage {
  type: string;
  payload?: IPayload;
}
