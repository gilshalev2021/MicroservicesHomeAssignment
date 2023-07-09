import express from 'express';
import rabbitmqController from "../controllers/rabbitmq.controller";
const messagesRoute = express.Router();

messagesRoute.post('/', (req, res) => {
  try {
    const { message } = req.body;
    
    rabbitmqController.sendMessageToRabbitMQ(message);

    res.status(200).json({ success: true, message: 'Message sent' });
  }
  catch (error: any) {
    console.error('Error:', error.message);
  
    res.status(500).json({ success: false, error: error.message });
  }
});

export default messagesRoute;
