import {useEffect, useRef, useState} from "react";
import * as React from "react";
import {IncomingMessage} from "../types";
import Toolbar from "./Toolbar.tsx";

const Canvas = () => {
    const canvasRef = useRef< HTMLCanvasElement| null>(null);
    const [painting,setPainting] = useState<boolean>(false);
    const [color,setColor] = useState<string>('black');
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/canvas');

        ws.current.onclose = () => console.log("ws closed");

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            if (decodedMessage.type === 'NEW_DRAWING' && ctx.current && decodedMessage.payload) {
                ctx.current.lineTo(decodedMessage.payload.x,decodedMessage.payload.y);
                ctx.current.stroke();
                ctx.current.strokeStyle = decodedMessage.payload.color;
            }

            if(decodedMessage.type === "FINISH"){
                ctx.current?.beginPath();
            }
        };

        if(canvasRef.current){
            ctx.current = canvasRef.current?.getContext('2d');

            canvasRef.current.width = window.innerWidth * 2;
            canvasRef.current.height = window.innerHeight * 2;
            canvasRef.current.style.width = window.innerWidth + 'px';
            canvasRef.current.style.height = window.innerHeight + 'px';

            if(ctx.current){
                ctx.current.scale(2,2);
                ctx.current.lineCap = "round";
                ctx.current.lineWidth = 5;
            }
        }

        return () => {
            ws.current?.close();
        }
    }, []);


    const finishDrawing = ()=>{
        if(ctx.current) ctx.current.closePath();
        setPainting(false);

        if(ws.current){
            ws.current.send(JSON.stringify({
                type:"FINISH",
                payload:{},
            }))
        }
    }

    const startDrawing = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement>)=>{
        const {offsetX,offsetY} = nativeEvent;
        if(ctx.current){
            ctx.current.beginPath();
            ctx.current.moveTo(offsetX,offsetY)
        }

        setPainting(true);
    }

    const draw = ({nativeEvent}: React.MouseEvent<HTMLCanvasElement>)=>{
        const {offsetX,offsetY} = nativeEvent;

        if(ctx.current && painting && ws.current){
            ctx.current.lineTo(offsetX,offsetY);
            ctx.current.stroke();
            ctx.current.strokeStyle = color;
            ws.current.send(JSON.stringify({
                type:"SEND_DRAWING",
                payload:{
                    x:offsetX,
                    y:offsetY,
                    color:color,
                }
            }))
        }
    }

    const handleSetColor = (color: string) =>{
        setColor(color);
    }

    return (
        <div>
            <canvas
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={finishDrawing}
                ref={canvasRef}
            />
            <Toolbar setColor={handleSetColor}/>
        </div>
    );
};

export default Canvas;