import express from 'express';
import { Kafka } from 'kafkajs';
import routes from './routes.js';

const server = express();

const kafka = new Kafka({
  clientId: 'main',
  brokers: ['localhost:9092'],
  retry: {
    retries: 3,
  },
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'user-response' });

server.use((req, res, next) => {
  req.producer = producer;
  return next();
});

server.use(routes);

async function messages() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-response', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
    },
  });
  server.listen(3001);
  console.log('server escuchando en 3001');
}

messages().catch((err) => console.log('este es el error', err));
