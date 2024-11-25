import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet()); // https://docs.nestjs.com/security/helmet
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();

  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Nest Template')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      persistAuthorization: true,
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      preloadModels: false,
      tryItOutEnabled: true,
      syntaxHighlight: true,
    },
    customSiteTitle: 'Nest Template',
  });
  await app.listen(port);
}
bootstrap();
