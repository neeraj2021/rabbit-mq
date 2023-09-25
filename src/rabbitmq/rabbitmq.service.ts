import { Injectable } from '@nestjs/common';
import * as amqplib from 'amqp-connection-manager';
import { Channel, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class RabbitmqService {
  private channelWrapper: ChannelWrapper;

  async connect() {
    try {
      const connection = amqplib.connect('amqp://localhost:5672', {
        heartbeatIntervalInSeconds: 10000,
      });
      connection.on('error', (err) => {
        console.error(err);
      });

      connection.on('close', () => {
        console.log('Connection to RabbitMQ closed');
      });

      connection.on('disconnect', () => {
        console.log('Disconnected from RabbitMQ');
      });

      connection.on('connect', () => {
        console.log('Connected to RabbitMQ');
      });

      this.channelWrapper = connection.createChannel({
        name: 'neeraj-test-channel',
        json: true,
        setup: (channel: Channel) => {
          return Promise.all([
            channel.assertQueue('test-queue', { durable: true }),
            channel.consume(
              'test-queue',
              (message) => {
                console.log(`Message received: ${message?.content.toString()}`);
                channel.ack(message);
              },
              {
                noAck: false,
              },
            ),
          ]);
        },
      });

      await this.channelWrapper.waitForConnect();
    } catch (error) {
      console.log(error);
    }
  }

  async sendToQueue(queue: string, message: string) {
    await this.channelWrapper.sendToQueue(queue, message);
  }
}
