import { RequestMethod } from "@nestjs/common";
import { RouteInfo } from "@nestjs/common/interfaces";

export const EXCLUDED_USER_MIDDLEWARE_ROUTES: RouteInfo[] = [
  { path: "/auth/login", method: RequestMethod.POST },
  { path: "/auth/register", method: RequestMethod.POST },
];
