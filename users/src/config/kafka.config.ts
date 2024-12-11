import { KafkaOptions, Transport } from '@nestjs/microservices';

const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'users',
      brokers: ['kafka-srv:9092'],
    },
    consumer: {
      groupId: 'user-consumers',
    },
  },
};

export default kafkaConfig;
