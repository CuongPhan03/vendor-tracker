import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionDto {
  message: string;

  statusCode: HttpStatus;

  constructor(message: string, statusCode: HttpStatus) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export function throwException(statusCode: HttpStatus, message: string) {
  throw new HttpException(new ExceptionDto(message, statusCode), statusCode);
}
