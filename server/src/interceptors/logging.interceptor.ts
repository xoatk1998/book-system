import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Logger } from "nestjs-pino";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(_context: ExecutionContext, call$: CallHandler): Observable<any> {
    const ctx = _context.switchToHttp();
    const req = ctx.getRequest();
    this.logger.log(
      {
        message: `HTTP Request`,
        data: {
          clientIP:
            req.headers["x-forwarded-for"] || req.connection.remoteAddress,
          method: req.method,
          originalUri: req.originalUrl,
          uri: req.url,
          referer: req.headers.referer || "",
          userAgent: req.headers["user-agent"],
          req: {
            body: Object.assign({}, req.body),
            headers: req.headers,
          },
        },
      },
      "LOG REQUEST BODY"
    );

    return call$.handle().pipe(
      map((data) => {
        this.logger.log({ responseBody: data }, "LOG RESPONSE BODY");
        return data;
      })
    );
  }
}
