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

/*
async function consumeMessage(): Promise<void> {
  try {
    console.log("BEFORE !!!");
    //const connection = await amqp.connect('amqp://localhost:5672');
    //const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
    const connection = await amqp.connect('amqp://guest:guest@172.28.0.1:5672');
    
    console.log("AFTER !!!");
    const channel = await connection.createChannel();
   
    //await channel.assertQueue('messageResponseQueue');
    await channel.assertQueue('messageQueue');

    // channel.consume('messageResponseQueue', (message) => {
    channel.consume('messageQueue', (message) => {
      if (message) {
        console.log("message arrived !!!");
        const status = JSON.parse(message.content.toString());
        console.log('Received message:', status);
        channel.ack(message);
      }
    });

    console.log('Consuming messages from the queue...');
  } catch (error: any) {
    console.log(`ERROR FOUND: ${error}`);
  }
}

async function startServer(): Promise<void> {
  app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT} !!!`);
  });

  setTimeout(async () => {
    await consumeMessage();
  }, 5000); // Wait for 5 seconds before connecting

  await consumeMessage();
}

startServer().catch((error) => {
  console.error('An unhandled error occurred:', error);
});
*/

//TODO
//'amqp://guest:guest@rabbitmq:5672');//  `amqp://${rabbitmqConfig.hostname}:${rabbitmqConfig.port}`);//'amqp://rabbitmq');//'amqp://localhost'