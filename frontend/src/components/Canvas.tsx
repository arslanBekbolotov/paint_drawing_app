import {useEffect, useRef, useState} from "react";
import * as React from "react";

const Canvas = () => {
    const canvasRef = useRef< HTMLCanvasElement| null>(null);
    const [painting,setPainting] = useState<boolean>(false);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
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
    }, []);


    const finishDrawing = ()=>{
        if(ctx.current) ctx.current.closePath();
        setPainting(false);
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

        if(ctx.current && painting){
            ctx.current.lineTo(offsetX,offsetY);
            ctx.current.stroke();
        }
    }

    return (
        <canvas
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={finishDrawing}
            ref={canvasRef}
            style={{border:'1px solid #ccc',backgroundColor:"#fff"}}
        />
    );
};

export default Canvas;