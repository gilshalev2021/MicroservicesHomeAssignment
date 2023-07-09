import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';

import rabbitmqController from "./controllers/rabbitmq.controller";

var corsOptions = {
  origin: '*',
};

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

const PORT = 5200;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

rabbitmqController.receiveMessages();