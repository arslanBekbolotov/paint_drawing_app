import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import crypto from "crypto";
import { ActiveConnections, IncomingMessage } from "./types";

const app = express();
const port = 8000;
expressWs(app);

app.use(cors());

const router = express.Router();
const activeConnections: ActiveConnections = {};
const paintingData: IncomingMessage[] = [];

router.ws("/canvas", (ws, req) => {
  const id = crypto.randomUUID();
  activeConnections[id] = ws;

  ws.on("message", (msg) => {
    const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
    switch (decodedMessage.type) {
      case "PREVIOUS_DRAWINGS":
        const conn = activeConnections[id];

        paintingData.map((painting) => {
          if (painting.type === "SEND_DRAWING") {
            conn.send(
              JSON.stringify({
                type: "NEW_DRAWING",
                payload: painting.payload,
              }),
            );
          } else {
            conn.send(
              JSON.stringify({
                type: "FINISH_DRAWING",
              }),
            );
          }
        });

        break;

      case "SEND_DRAWING":
        paintingData.push(decodedMessage);

        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];
          if (connId !== id) {
            conn.send(
              JSON.stringify({
                type: "NEW_DRAWING",
                payload: decodedMessage.payload,
              }),
            );
          }
        });

        break;

      case "FINISH":
        paintingData.push(decodedMessage);

        Object.keys(activeConnections).forEach((connId) => {
          const conn = activeConnections[connId];
          if (connId !== id) {
            conn.send(
              JSON.stringify({
                type: "FINISH_DRAWING",
              }),
            );
          }
        });
        break;
      default:
        console.log("Unknown message type:", decodedMessage.type);
    }
  });

  ws.on("close", () => {
    delete activeConnections[id];
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});
