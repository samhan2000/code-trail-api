import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const allowedOrigins = ['http://localhost:3001'];

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || `api`);

  app.enableCors({
    origin: "*"
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
