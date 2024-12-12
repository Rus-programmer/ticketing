import { Transport, KafkaOptions } from '@nestjs/microservices';

const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'auth',
      brokers: ['kafka-srv:9092'],
    },
    consumer: {
      groupId: 'auth-consumers',
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
    },
  },
};

export default kafkaConfig;
