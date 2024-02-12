// KafkaConsumer.ts
const { Kafka } = require('kafkajs')
import { Consumer } from 'kafkajs';
import { updateCodeInCodeEditor } from './CodeEditorService';

class KafkaConsumer {
  private consumer: Consumer;

  constructor() {
    this.consumer = new Kafka({
      clientId: 'code-consumer',
      brokers: ['kafka:9092'],
    }).consumer({ groupId: 'code_changes_group' });
  }

  async consumeCodeChanges() {
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: `code_changes`, fromBeginning: true });

    // Consume code changes
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        const { roomId, userId, delta } = JSON.parse(message.value);
        await updateCodeInCodeEditor(roomId, userId, delta);
      },
    });

  }
}

export default KafkaConsumer;
