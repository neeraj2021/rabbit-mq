import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.get(RabbitmqService).connect();
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
