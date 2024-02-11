const { Kafka } = require('kafkajs')

class KafkaProducer {
  private producer: any;

  constructor() {
    this.producer = new Kafka({
      clientId: 'code-producer',
      brokers: ['localhost:9092'],
    }).producer();
  }

  async produceCodeChanges(roomId: string, userId: string, delta: any) {
    await this.producer.connect();
    await this.producer.send({
      topic: `code_changes_${roomId}`,
      messages: [{ value: JSON.stringify({ userId, delta }) }],
    });
    await this.producer.disconnect();
  }
}

export default KafkaProducer;
