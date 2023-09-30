import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

const app = express();
const port = 8000;
expressWs(app);

app.use(cors());


app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});
