import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ExceptionDto } from 'src/common/exception/exception.dto';

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    console.error('Exception caught by AppExceptionsFilter:', exception);
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: ExceptionDto = {
      statusCode: httpStatus,
      message:
        exception?.response?.message ??
        'Internal server error. Please try again later.',
    };

    ctx.getResponse().status(httpStatus).json(responseBody);
  }
}
