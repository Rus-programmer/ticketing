import { Transport, KafkaOptions } from '@nestjs/microservices';

const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'expiration',
      brokers: ['kafka-srv:9092'],
    },
    consumer: {
      groupId: 'expiration-consumers',
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
