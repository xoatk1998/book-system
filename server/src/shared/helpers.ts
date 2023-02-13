import * as config from "config";
import { HttpException, HttpStatus } from "@nestjs/common";

export interface IGeneralErrorShape {
  message: string;
  description?: string;
  statusCode?: HttpStatus;
  stackTrace?: any;
  logData?: any;
  data?: any;
}

export const getHost = () => {
  const hostname = config.get("server.hostname");
  if (hostname) {
    return `${hostname}`;
  }
  return `${config.get("server.host")}:${config.get("server.port")}`;
};

export const getAbsoluteBaseUrl = () =>
  `${config.get("server.scheme")}://${getHost()}`;

export const getAbsoluteDocsBaseUrl = () =>
  `${config.get("server.scheme")}://${getHost()}${config.get(
    "service.docsBaseUrl"
  )}`;

export function createGeneralExceptionError(error): IGeneralErrorShape {
  if (!error) {
    return {
      message: "Internal server error occurred",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
  if (error instanceof HttpException) {
    const res = error.getResponse();
    if (typeof res === "string") {
      return {
        statusCode: error.getStatus(),
        message: res,
      };
    }
    return error.getResponse() as IGeneralErrorShape;
  }
  if (error instanceof Error) {
    return {
      message: error.message,
      description: error.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  return {
    message: error.message,
  };
}
