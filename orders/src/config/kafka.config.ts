import { Transport, KafkaOptions } from '@nestjs/microservices';

const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'orders',
      brokers: ['kafka-srv:9092'],
    },
    consumer: {
      groupId: 'orders-consumers',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
    run: {
      autoCommit: false,
    },
  },
};

export default kafkaConfig;
