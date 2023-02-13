import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { createGeneralExceptionError } from "../shared/helpers";
import { Logger } from "nestjs-pino";

export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const responseError = createGeneralExceptionError(err);
    this.logger.error({ responseError }, err["stack"], "LOG RESPONSE ERROR");
    response.status(responseError.statusCode).json(responseError);
  }
}
