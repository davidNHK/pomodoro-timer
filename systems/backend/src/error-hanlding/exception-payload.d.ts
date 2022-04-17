import { ErrorCode } from './error-code.constant';

export interface ExceptionPayload {
  code: ErrorCode;
  debugDetails?: Record<string, unknown>;
  errors: string[];
  meta?: Record<string, unknown>;
}
