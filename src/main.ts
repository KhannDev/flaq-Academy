import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Setting up swagger
  const config = new DocumentBuilder()
    .setTitle('Demo Application')
    .setDescription('Demo API Application')
    .setVersion('v1')
    .addTag('books')
    .build();

  // console.log(app);
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
