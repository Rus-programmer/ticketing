import { KafkaContext } from '@nestjs/microservices';

export async function commitOffsets(context: KafkaContext) {
  const { offset } = context.getMessage();
  const partition = context.getPartition();
  const topic = context.getTopic();
  const consumer = context.getConsumer();
  await consumer.commitOffsets([
    { topic, partition, offset: String(+offset + 1) },
  ]);
}
