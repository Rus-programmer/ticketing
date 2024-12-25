import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  CREATE_USER,
  GET_USER_BY_EMAIL,
  GET_USER_BY_ID,
  ORDER_CREATED,
  ORDER_EXPIRED,
  TICKET_CREATED,
} from '../constants/topics.constants';

@Injectable()
export class KafkaTopicsService implements OnModuleInit {
  async onModuleInit() {
    const kafka = new Kafka({
      brokers: ['kafka-srv:9092'],
    });
    const admin = kafka.admin();
    await admin.createTopics({
      topics: [
        {
          topic: CREATE_USER,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: `${CREATE_USER}.reply`,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: GET_USER_BY_EMAIL,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: `${GET_USER_BY_EMAIL}.reply`,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: GET_USER_BY_ID,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: `${GET_USER_BY_ID}.reply`,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: TICKET_CREATED,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: `${TICKET_CREATED}.reply`,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: ORDER_CREATED,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: `${ORDER_CREATED}.reply`,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: ORDER_EXPIRED,
          numPartitions: 3,
          replicationFactor: 1,
        },
        {
          topic: `${ORDER_EXPIRED}.reply`,
          numPartitions: 3,
          replicationFactor: 1,
        },
      ],
    });
    console.log('topics created');
  }
}
