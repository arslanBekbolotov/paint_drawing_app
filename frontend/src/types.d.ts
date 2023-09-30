export interface IPayload{
    x:string;
    y:string;
    color:string;
}

export interface IncomingMessage{
    type:string;
    payload:IPayload;
}