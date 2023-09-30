import {WebSocket} from 'ws';

export interface ActiveConnections {
    [id: string]: WebSocket
}

export interface IPayload{
    x:string;
    y:string;
    color:string;
}

export interface IncomingMessage {
    type: string;
    payload: IPayload;
}