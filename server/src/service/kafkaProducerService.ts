import { Producer } from "kafkajs";

const { Kafka } = require('kafkajs')

class KafkaProducer {
  private producer: Producer;

  constructor() {
    this.producer = new Kafka({
      clientId: 'code-producer',
      brokers: ['kafka:9092'],
    }).producer();
  }

  async produceCodeChanges(roomId: string, userId: string, delta: any) {
    await this.producer.connect();
    await this.producer.send({
      topic: `code_changes`,
      messages: [{ value: JSON.stringify({ roomId, userId, delta }) }],
    });
    await this.producer.disconnect();
  }
}

export default KafkaProducer;
