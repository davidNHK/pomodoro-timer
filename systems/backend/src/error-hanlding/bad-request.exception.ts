import { HttpException, HttpStatus } from '@nestjs/common';

import {
  ExceptionPayload,
  exceptionPayloadToResponse,
} from './exception-payload';

export class BadRequestException extends HttpException {
  debugDetails?: Record<string, unknown> | undefined; // Only visible on access log

  constructor(response: ExceptionPayload) {
    const { code, debugDetails, errors, meta } = response;
    super(
      exceptionPayloadToResponse({
        code,
        errors,
        meta,
      }),
      HttpStatus.BAD_REQUEST,
    );
    this.debugDetails = debugDetails;
  }
}
