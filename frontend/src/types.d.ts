export interface IPayload{
    x:number;
    y:number;
    color:string;
}

export interface IncomingMessage{
    type:string;
    payload?:IPayload;
}