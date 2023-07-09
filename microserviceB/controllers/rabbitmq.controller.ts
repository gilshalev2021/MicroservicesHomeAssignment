import amqp from 'amqplib';
import mongodbController from "./mongodb.controller";

const rabbitmqConfig = {
    hostname: 'localhost',//'rabbitmq'
    port: 5672,
    queue: 'messageQueue',
    responseQueue: 'messageResponseQueue',
  };

class RabbitMQController {

  async processMessage(message: string) {
    try {
      mongodbController.insertMessageToDB(message);

      this.sendMessageToRabbitMQ(message);
      
    } catch (error: any) {

      console.error('Error:', error.message);
    }
  }

  async sendMessageToRabbitMQ(message: string) {
    try{
      const connection = await amqp.connect(`amqp://${rabbitmqConfig.hostname}:${rabbitmqConfig.port}`);

      const channel = await connection.createChannel();
      
      await channel.assertQueue(rabbitmqConfig.responseQueue);
      
      const status = { message, status: 'success' };

      channel.sendToQueue(rabbitmqConfig.responseQueue, Buffer.from(JSON.stringify(status)));

      setTimeout(() => {
        connection.close();
      }, 500);

    } catch (error: any) {
      console.error('Error:', error.message);
    }
  }
  
  async receiveMessages ()  {
    try {
      console.log('Start Waiting for messages...');

      const connection = await amqp.connect(`amqp://${rabbitmqConfig.hostname}:${rabbitmqConfig.port}`);

      const channel = await connection.createChannel();
  
      await channel.assertQueue(rabbitmqConfig.queue);
  
      console.log('Waiting for messages...');
     
      channel.consume(rabbitmqConfig.queue, (msg:any) => {
       
        const message = msg.content.toString();
       
        this.processMessage(message);
     
        channel.ack(msg);
      });
    } catch (error: any) {
      console.error('Error:', error);
      console.error('ErrorMessage:', error.message);
    }
  };
}

const rabbitMQController = new RabbitMQController();

export default rabbitMQController;