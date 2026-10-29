import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  HttpStatus,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { ExceptionDto } from './common/exception/exception.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) =>
          error.constraints ? Object.values(error.constraints) : [],
        );

        throw new BadRequestException(
          new ExceptionDto(
            messages.length ? messages.join(', ') : 'Validation failed',
            HttpStatus.BAD_REQUEST,
          ),
        );
      },
    }),
  );
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'files/:name', method: RequestMethod.GET }],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
