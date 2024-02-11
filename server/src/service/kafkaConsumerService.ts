// KafkaConsumer.ts
const { Kafka, EachMessagePayload } = require('kafkajs')
import { updateCodeInCodeEditor } from './CodeEditorService';

class KafkaConsumer {
  private consumer: any;

  constructor() {
    this.consumer = new Kafka({
      clientId: 'code-consumer',
      brokers: ['localhost:9092'],
    }).consumer({ groupId: 'code_changes_group' });
  }

  async consumeCodeChanges() {
    await this.consumer.connect();

    // Subscribe to Kafka topics for each room
    const rooms = ["room1", "room2", /* ... */];
    rooms.forEach(room => this.consumer.subscribe({ topic: `code_changes_${room}`, fromBeginning: true }));

    // Consume code changes
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        const { userId, delta } = JSON.parse(message.value);
        const id = ""
        await updateCodeInCodeEditor(id, userId, delta);
      },
    });
  }
}

export default KafkaConsumer;
