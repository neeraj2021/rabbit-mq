import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/send')
  async sendMessageToQueue(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      await this.rabbitmqService.sendToQueue('test-queue', `Message ${i}`);
      console.log(`Index: ${i}`);
    }
    return 'Message sent';
  }
}
