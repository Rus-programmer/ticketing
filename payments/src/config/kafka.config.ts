import { KafkaOptions, Transport } from '@nestjs/microservices';

const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'payments',
      brokers: ['kafka-srv:9092'],
    },
    consumer: {
      groupId: 'payments-consumers',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};

export default kafkaConfig;
