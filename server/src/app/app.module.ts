import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BooksModule } from "../modules/books/books.module";
import * as config from "config";
import { AuthModule } from "../modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { FireBaseAuthMiddleware } from "../middlewares/firebase.auth.middleware";
import { FirebaseAdminModule } from "@aginix/nestjs-firebase-admin";
import * as admin from "firebase-admin";
import { getConfig } from "../modules/config/config.provider";
import { LoggerModule } from "nestjs-pino";
const config = getConfig();
const serviceAccount = JSON.parse(config.get("firebase.admin"));

@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert(serviceAccount),
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => req.id,
        formatters: {
          level: (label: string, number: number) => ({ label, number }),
          bindings: (bindings) => ({ pid: bindings.pid }),
        },
        redact: {
          censor: "-",
          paths: ["req.headers.cookie"],
        },
        autoLogging: false,
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
          }),
        },
      },
    }),
    MongooseModule.forRoot(config.get("mongodb.uri")),
    BooksModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FireBaseAuthMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
