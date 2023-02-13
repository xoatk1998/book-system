import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as config from "config";
import { getAbsoluteBaseUrl, getAbsoluteDocsBaseUrl } from "./shared/helpers";
import { Console } from "console";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { Logger } from "nestjs-pino";
import { CORS_EXPOSED_HEADERS, ACCESS_TOKEN_HEADER_NAME } from "./shared/constants";

const initSwagger = async (app) => {
  const configSwagger = new DocumentBuilder()
    .setTitle("Book System")
    .setDescription("The book API description")
    .setVersion("1.0")
    .addTag("auth")
    .addTag("book")
    .addApiKey(null, ACCESS_TOKEN_HEADER_NAME)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup(config.get("service.docsBaseUrl"), app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((_, res, next) => {
    res.setHeader("x-api-version", process.env.API_VERSION);
    next();
  });

  await initSwagger(app);
  const logger = app.get(Logger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    exposedHeaders: CORS_EXPOSED_HEADERS,
  });
  await app.listen(+config.get("server.port"));

  return app;
}
bootstrap().then((app) => {
  const logger = app.get(Logger);
  logger.log(`Started on ${getAbsoluteBaseUrl()}`);
  logger.log(`Docs available on ${getAbsoluteDocsBaseUrl()}`);
});
