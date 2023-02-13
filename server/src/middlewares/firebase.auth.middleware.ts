import {
  Inject,
  Injectable,
  NestMiddleware,
  RequestMethod,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { RouteInfo } from "@nestjs/common/interfaces";
import { FirebaseAuthenticationService } from "@aginix/nestjs-firebase-admin";
import { CONFIG } from "../modules/config/config.provider";
import { IConfig } from "config";
import { EXCLUDED_USER_MIDDLEWARE_ROUTES } from "./constants";
import { ACCESS_TOKEN_HEADER_NAME } from "../shared/constants";

@Injectable()
export class FireBaseAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly firebaseAuth: FirebaseAuthenticationService,
    @Inject(CONFIG) private readonly config: IConfig
  ) {}

  async use(req: Request, res: Response, next: Function) {
    const isPublicRoute = EXCLUDED_USER_MIDDLEWARE_ROUTES.some(
      (excludedRoute: RouteInfo) => {
        return (
          req.originalUrl.includes(`${excludedRoute.path}`) &&
          (excludedRoute.method === RequestMethod[req.method as string] ||
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            req.method === RequestMethod.ALL)
        );
      }
    );

    if (isPublicRoute) {
      return next();
    }

    const token = req.headers[ACCESS_TOKEN_HEADER_NAME] as string;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      await this.firebaseAuth.verifyIdToken(token);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    next();
  }
}
