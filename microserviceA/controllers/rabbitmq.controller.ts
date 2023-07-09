import amqp from 'amqplib';

const rabbitmqConfig = {
    hostname: 'localhost',//'rabbitmq'
    port: 5672,
    queue: 'messageQueue',
    responseQueue: 'messageResponseQueue',
  };

class RabbitMQController {

  
  async receiveStatusMessages (io: any)  {
    try {
      const connection = await amqp.connect(`amqp://${rabbitmqConfig.hostname}:${rabbitmqConfig.port}`);

      const channel = await connection.createChannel();

      await channel.assertQueue(rabbitmqConfig.responseQueue);
  
      channel.consume(rabbitmqConfig.responseQueue, (msg:any) => {

        const status = JSON.parse(msg.content.toString());

        io.emit('messageStatus', status);

        channel.ack(msg);
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      console.error('ErrorMessage:', error.message);
    }
  };

  async sendMessageToRabbitMQ(message: string) {
      const connection = await amqp.connect(`amqp://${rabbitmqConfig.hostname}:${rabbitmqConfig.port}`);

      const channel = await connection.createChannel();
     
      await channel.assertQueue(rabbitmqConfig.queue);
     
      channel.sendToQueue(rabbitmqConfig.queue, Buffer.from(message));

      setTimeout(() => {
        connection.close();
      }, 500);
  }
}

const rabbitMQController = new RabbitMQController();

export default rabbitMQController;