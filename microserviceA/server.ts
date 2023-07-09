import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import messagesRoute from './routes/message.route';
import * as bodyParser from 'body-parser';
import rabbitmqController from "./controllers/rabbitmq.controller";
import { Server, Socket } from 'socket.io';

var corsOptions = {
  origin: '*',
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', async (socket: Socket) => {

  console.log('WebSocket connection established.');

  await rabbitmqController.receiveStatusMessages(io);
 
  socket.on('disconnect', () => {
    console.log('WebSocket connection closed.');
  });
 
});

app.use('/message', messagesRoute);

const PORT = 5100;

server.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}`);
});