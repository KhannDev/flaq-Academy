import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  //Setting up swagger
  const config = new DocumentBuilder()
    .setTitle('Flaq')
    .setDescription('Flaq App API description')
    .setVersion('v1')
    .addBearerAuth()
    .build();

  app.enableCors();
  // console.log(app);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const server = await app.listen(process.env.PORT || 3000);
  server.keepAliveTimeout = 65000;
}
bootstrap();
