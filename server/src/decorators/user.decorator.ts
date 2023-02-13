import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import * as jsonWebToken from "jsonwebtoken";
import * as BPromise from "bluebird";
import { ACCESS_TOKEN_HEADER_NAME } from "../shared/constants";
const jwt = BPromise.promisifyAll(jsonWebToken);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const accessToken = request.headers[ACCESS_TOKEN_HEADER_NAME];
    if (accessToken) {
      const decodedToken = jwt.decode(accessToken);
      const userId = decodedToken?.sub;
      if (userId) {
        return userId;
      }
    }
    return null;
  }
);
