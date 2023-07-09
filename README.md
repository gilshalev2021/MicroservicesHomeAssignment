"Cync: React ,Microservices & Messaging Home Assignment"

Currently, you need to run the solution locally, from the IDE:

(later on I'll add an option to run all the client and the services: 
microserviceA, microserviceB, mongoDB and rabbitMQ as dockers, under docker-compose)

To run cync-client:
  run npm i
  run npm start
  (The client will run on port 3000 - open http://localhost:3000 in your browser)

To run microserviceA:
  run npm i
  run npm start
  (The microservice will run on port 5100)

To run microserviceB:
  run npm i
  run npm start
  (The microservice will run on port 5200)

To run rabbitMQ:
  docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management

You need to have local mongoDB installed
