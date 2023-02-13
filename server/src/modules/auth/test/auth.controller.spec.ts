import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { User } from "../../../decorators/user.decorator";
import { UserRepository } from "../../../modules/users/user.repository";
import { AppModule } from "../../../app/app.module";
import { testGlobal } from "../../../shared/testGlobal";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { registerData, registerResponse } from "./auths.mocks";
import * as config from 'config';

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserRepository,
        { provide: getModelToken(User.name), useValue: jest.fn() },
      ],
    })
    .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  // describe("POST /register", () => {
  //   beforeEach(() => {
  //     authService.register = jest.fn().mockReturnValue(registerResponse);
  //     jest.setTimeout(30000);
  //   });
  //   it(`should register success`, async () => {
  //     const result = await authController.register(registerData);

  //     expect(result).toEqual(registerResponse);
  //     expect(authService.register).toBeCalledWith(registerData);
  //   });
  // });

});
