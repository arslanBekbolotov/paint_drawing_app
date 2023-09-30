import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import crypto from "crypto";
import {ActiveConnections, IncomingMessage} from "./types";

const app = express();
const port = 8000;
expressWs(app);

app.use(cors());

const router = express.Router();
const activeConnections: ActiveConnections = {};

router.ws('/canvas', (ws, req) => {
    const id = crypto.randomUUID();
    activeConnections[id] = ws;

    ws.on('message', (msg) => {
        const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
        switch (decodedMessage.type) {
            case 'SEND_DRAWING':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    if(connId !== id){
                        conn.send(JSON.stringify({
                            type: 'NEW_DRAWING',
                            payload: decodedMessage.payload,
                        }));
                    }
                });
                break;

            case 'FINISH':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[connId];
                    if(connId !== id){
                        conn.send(JSON.stringify({
                            type: 'FINISH',
                            payload:{},
                        }));
                    }
                });
                break;
            default:
                console.log('Unknown message type:', decodedMessage.type);
        }
    });

    ws.on('close', () => {
        delete activeConnections[id];
    });
});

app.use(router);

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});
