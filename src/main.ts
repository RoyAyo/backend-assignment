import * as compression from 'compression';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { TypeormExceptionFilter } from './common/filters/typeorm-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter(), new TypeormExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggerInterceptor());

  app.enableCors({ origin: '*' });
  app.use(
    helmet({
      xXssProtection: true,
      strictTransportSecurity: { maxAge: 2592000, includeSubDomains: true },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );
  app.use(compression());

  await app.listen(3000);
}
bootstrap().then(() => {
  console.info(`
    -------------------------------------------
      Server Application Started!
      BASE URL: http://localhost:3000/
    -------------------------------------------
  `);
});
