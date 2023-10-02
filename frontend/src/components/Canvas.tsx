import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { IncomingMessage } from "../types";
import Toolbar from "./Toolbar.tsx";

const Canvas = () => {
  const [painting, setPainting] = useState<boolean>(false);
  const [color, setColor] = useState<string>("black");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const [tool, setTool] = useState<string>("brush");
  const radius = 20;

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/canvas");

    ws.current.onclose = () => console.log("ws closed");

    ws.current.onopen = () => {
      ws.current?.send(
        JSON.stringify({
          type: "PREVIOUS_DRAWINGS",
        }),
      );
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as IncomingMessage;

      if (ctx.current && decodedMessage.payload) {
        if (decodedMessage.type === "NEW_DRAWING") {
          ctx.current.lineTo(
            decodedMessage.payload.x,
            decodedMessage.payload.y,
          );
          ctx.current.stroke();
          ctx.current.strokeStyle = decodedMessage.payload.color;
        }
        if (decodedMessage.type === "NEW_CIRCLE") {
          ctx.current.beginPath();
          ctx.current.arc(
            decodedMessage.payload.x,
            decodedMessage.payload.y,
            radius,
            0,
            2 * Math.PI,
          );
          ctx.current.strokeStyle = decodedMessage.payload.color;
          ctx.current.stroke();
        }
      }

      if (decodedMessage.type === "FINISH_DRAWING") {
        ctx.current?.beginPath();
      }
    };

    if (canvasRef.current) {
      ctx.current = canvasRef.current?.getContext("2d");

      canvasRef.current.width = window.innerWidth * 2;
      canvasRef.current.height = window.innerHeight * 2;
      canvasRef.current.style.width = window.innerWidth + "px";
      canvasRef.current.style.height = window.innerHeight + "px";

      if (ctx.current) {
        ctx.current.scale(2, 2);
        ctx.current.lineCap = "round";
        ctx.current.lineWidth = 5;
      }
    }

    return () => {
      ws.current?.close();
    };
  }, []);

  const finishDrawing = () => {
    if (ctx.current) ctx.current.beginPath();
    setPainting(false);

    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "FINISH",
        }),
      );
    }
  };

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;

    if (tool === "circle" && ws.current && ctx.current) {
      ctx.current.beginPath();
      ctx.current.arc(offsetX, offsetY, radius, 0, 2 * Math.PI);
      ctx.current.strokeStyle = color;
      ctx.current.stroke();

      ws.current.send(
        JSON.stringify({
          type: "SEND_CIRCLE",
          payload: {
            x: offsetX,
            y: offsetY,
            color: color,
          },
        }),
      );
    }

    if (ctx.current && canvasRef.current) {
      ctx.current.beginPath();
      ctx.current.moveTo(offsetX, offsetY);
    }

    setPainting(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;

    if (ctx.current && painting && ws.current && tool === "brush") {
      ctx.current.lineTo(offsetX, offsetY);
      ctx.current.stroke();
      ctx.current.strokeStyle = color;

      ws.current.send(
        JSON.stringify({
          type: "SEND_DRAWING",
          payload: {
            x: offsetX,
            y: offsetY,
            color: color,
          },
        }),
      );
    }
  };

  const handleSetColor = (color: string) => {
    setColor(color);
  };

  const handleSetTool = (tool: string) => {
    setTool(tool);
  };

  return (
    <div>
      <canvas
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        ref={canvasRef}
      />
      <Toolbar setStrokeColor={handleSetColor} setTool={handleSetTool} />
    </div>
  );
};

export default Canvas;
