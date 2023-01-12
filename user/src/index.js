import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'user',
  brokers: ['localhost:9092'],
  retry: {
    retries: 3,
  },
});

const consumer = kafka.consumer({ groupId: 'user-group' });
const producer = kafka.producer();

async function messages() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: 'user', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });

      producer.send({
        topic: 'user-response',
        messages: [{ value: 'successfully registered user' }],
      });
    },
  });
  //   server.listen(3002);
  //   console.log('server escuchando en 3002');
}

messages().catch((err) => console.log('este es el error', err));
