import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import * as qs from "qs";
import { RegisterDto } from "./register.dto";
import {
  FirebaseAuthenticationService,
} from "@aginix/nestjs-firebase-admin";
import {
  LoginDto,
  RefreshTokenDto,
  RequestResetPassword,
  UpdateInfoDto,
} from "./login.dto";
import { FirebaseRefreshResponse, LoginResponse } from "./auth.interface";
import { CONFIG } from "../config/config.provider";
import { IConfig } from "config";
import { FirebaseClientToken } from "../firebaseClient/firebaseClient.provider";
import { PinoLogger } from "nestjs-pino";
import { HttpService } from "@nestjs/axios";
import { UserRepository } from "../users/user.repository";
import { IUser } from "../users/user.interface";
import { resolve } from "path";

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly firebaseAuth: FirebaseAuthenticationService,
    private readonly userRepository: UserRepository,
    @Inject(CONFIG) private readonly config: IConfig,
    @Inject(FirebaseClientToken) private readonly firebaseClientService,
    private readonly logger: PinoLogger
  ) {}

  async register(registerDto: RegisterDto): Promise<IUser> {
    // await this.sleep(5000)
    //     return {"uid":"lJi0QJZk4hgRgifBLpZBXW29IJs2","displayName":null,"photoURL":null,"email":"thien.nguyen+123@gmail.com","emailVerified":false,"phoneNumber":null,"isAnonymous":false,"tenantId":null,"providerData":[{"uid":"thien.nguyen+123@gmail.com","displayName":null,"photoURL":null,"email":"thien.nguyen+123@gmail.com","phoneNumber":null,"providerId":"password"}],"apiKey":"AIzaSyBQGHYPj9ZNshDyNSCMMgZoyn9f4TXuwYM","appName":"[DEFAULT]","authDomain":"books-system-c7863.firebaseapp.com","stsTokenManager":{"apiKey":"AIzaSyBQGHYPj9ZNshDyNSCMMgZoyn9f4TXuwYM","refreshToken":"APZUo0Twk233_nmniKcXNdcOZNwakvXIK5qW3zibjMc9csnB94fXbxXP-9ZL7vWQMK1lVT2CXm7OkAmMmYKCOd42JnYE_Mai6y4YgH5Et8w0yOT4XiP3-yzGUr7D7TAmhzuFbz9NoIZGH0XMD-lkgJMVjvIkfjxW_1hBUGhe5SNi4VchNfMPzgXbz40D-6A9hqeYVuoqpDslGBkREi1km7xIeuOL7OvIIyzEMCexJFEeuEPPjCIqhpY","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2NzE1ZTJmZjcxZDIyMjQ5ODk1MDAyMzY2ODMwNDc3Mjg2Nzg0ZTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm9va3Mtc3lzdGVtLWM3ODYzIiwiYXVkIjoiYm9va3Mtc3lzdGVtLWM3ODYzIiwiYXV0aF90aW1lIjoxNjgzMzA4NDE5LCJ1c2VyX2lkIjoibEppMFFKWms0aGdSZ2lmQkxwWkJYVzI5SUpzMiIsInN1YiI6ImxKaTBRSlprNGhnUmdpZkJMcFpCWFcyOUlKczIiLCJpYXQiOjE2ODMzMDg0MTksImV4cCI6MTY4MzMxMjAxOSwiZW1haWwiOiJ0aGllbi5uZ3V5ZW4rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0aGllbi5uZ3V5ZW4rMTIzQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.LFZc-SpK7XgbDpKEAVLRnCEuUyAyqOUjzoTzJCWI-hOoxOjGOTcTC25AS7P54z-TtY8zYGOAvLZBqr_1s6x62opbZzlyvQoAaNvp4YgF4ESXr1hk2c_X3Y2zmICFoWi-uRcMFg0sj-uLLg8XZXOw8cFJxy6BT6IWbp92wHX_qc632OpxP0-KRlQ6nZWtWL3CnrNxYClAMPjCMq-gCcVxw0kIvmCPGOFLjL_OSvJgEc2cn-03oMGBMqRTd5mnK3KKX5ApjUYnZpcUgHojzjSok1TalQM435u6uQ8Lo2T18K3x72xmfy4c4sWAA9oP0A1e8O9pZNMpPpJuIThjaJ2lIQ","expirationTime":1683312019697},"redirectEventId":null,"lastLoginAt":"1683308396106","createdAt":"1683307682429","multiFactor":{"enrolledFactors":[]}} as any;
    let { email } = registerDto;
    email = email.toLowerCase().trim();
    const user = await this.userRepository.findOne({ email });
    if (user) {
      throw new UnprocessableEntityException(
        `${email} has been registered before`
      );
    }
    try {
      const firebaseUser = await this.firebaseAuth.createUser(registerDto);
      return await this.userRepository.create({
        email: registerDto.email,
        name: registerDto.name,
        userId: firebaseUser.uid,
      });
    } catch (e) {
      this.logger.error("AuthService::Register failed", e);
      throw new BadRequestException(e.message);
    }
  }

  async refreshToken(refreshInput: RefreshTokenDto) {
    const firebaseClientCredential = this.config.get<string>("firebase.client");
    const apiKey = JSON.parse(firebaseClientCredential).apiKey;
    const firebaseRefreshUrl = this.config.get<string>(
      "firebase.refreshTokenUrl"
    );
    const url = `${firebaseRefreshUrl}?key=${apiKey}`;
    try {
      const refreshResponse = await this.httpService
        .post<FirebaseRefreshResponse>(
          url,
          qs.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshInput.refreshToken,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .toPromise();

      return {
        accessToken: refreshResponse.data.access_token,
        refreshToken: refreshResponse.data.refresh_token,
        expiresIn: refreshResponse.data.expires_in,
      };
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }

  async indexUser() {
    const users = await this.userRepository.find({});
    return users || [];
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    // await this.sleep(2000);
    // return {"uid":"lJi0QJZk4hgRgifBLpZBXW29IJs2","displayName":null,"photoURL":null,"email":"thien.nguyen+123@gmail.com","emailVerified":false,"phoneNumber":null,"isAnonymous":false,"tenantId":null,"providerData":[{"uid":"thien.nguyen+123@gmail.com","displayName":null,"photoURL":null,"email":"thien.nguyen+123@gmail.com","phoneNumber":null,"providerId":"password"}],"apiKey":"AIzaSyBQGHYPj9ZNshDyNSCMMgZoyn9f4TXuwYM","appName":"[DEFAULT]","authDomain":"books-system-c7863.firebaseapp.com","stsTokenManager":{"apiKey":"AIzaSyBQGHYPj9ZNshDyNSCMMgZoyn9f4TXuwYM","refreshToken":"APZUo0Twk233_nmniKcXNdcOZNwakvXIK5qW3zibjMc9csnB94fXbxXP-9ZL7vWQMK1lVT2CXm7OkAmMmYKCOd42JnYE_Mai6y4YgH5Et8w0yOT4XiP3-yzGUr7D7TAmhzuFbz9NoIZGH0XMD-lkgJMVjvIkfjxW_1hBUGhe5SNi4VchNfMPzgXbz40D-6A9hqeYVuoqpDslGBkREi1km7xIeuOL7OvIIyzEMCexJFEeuEPPjCIqhpY","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2NzE1ZTJmZjcxZDIyMjQ5ODk1MDAyMzY2ODMwNDc3Mjg2Nzg0ZTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm9va3Mtc3lzdGVtLWM3ODYzIiwiYXVkIjoiYm9va3Mtc3lzdGVtLWM3ODYzIiwiYXV0aF90aW1lIjoxNjgzMzA4NDE5LCJ1c2VyX2lkIjoibEppMFFKWms0aGdSZ2lmQkxwWkJYVzI5SUpzMiIsInN1YiI6ImxKaTBRSlprNGhnUmdpZkJMcFpCWFcyOUlKczIiLCJpYXQiOjE2ODMzMDg0MTksImV4cCI6MTY4MzMxMjAxOSwiZW1haWwiOiJ0aGllbi5uZ3V5ZW4rMTIzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0aGllbi5uZ3V5ZW4rMTIzQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.LFZc-SpK7XgbDpKEAVLRnCEuUyAyqOUjzoTzJCWI-hOoxOjGOTcTC25AS7P54z-TtY8zYGOAvLZBqr_1s6x62opbZzlyvQoAaNvp4YgF4ESXr1hk2c_X3Y2zmICFoWi-uRcMFg0sj-uLLg8XZXOw8cFJxy6BT6IWbp92wHX_qc632OpxP0-KRlQ6nZWtWL3CnrNxYClAMPjCMq-gCcVxw0kIvmCPGOFLjL_OSvJgEc2cn-03oMGBMqRTd5mnK3KKX5ApjUYnZpcUgHojzjSok1TalQM435u6uQ8Lo2T18K3x72xmfy4c4sWAA9oP0A1e8O9pZNMpPpJuIThjaJ2lIQ","expirationTime":1683312019697},"redirectEventId":null,"lastLoginAt":"1683308396106","createdAt":"1683307682429","multiFactor":{"enrolledFactors":[]}} as any;
    // const a = await this.userRepository.findAll();
    // console.log(a, '----a');
    const user = await this.userRepository.findOne({ email: loginDto.email });
    if (!user || !user?.userId) {
      throw new BadRequestException(`${loginDto.email} not found`);
    }
    try {
      const loginRes = await this.firebaseClientService
        .auth()
        .signInWithEmailAndPassword(loginDto.email, loginDto.password)

      return loginRes.user;
    } catch (e) {
      console.log("🚀 ~ file: auth.service.ts:109 ~ AuthService ~ login ~ e:", e)
      throw new UnauthorizedException(e.message);
    }
  }

  async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    })
  }

  async me(userId: string): Promise<IUser> {
    const user = await this.userRepository.findOne({ userId });
    if (!user || !user?.userId) {
      throw new BadRequestException(`${userId} not found`);
    }
    return user;
  }

  async logout(token: string): Promise<any> {
    return this.firebaseClientService.auth().signOut();
  }

  async updateInfo(userId: string, updateDto: UpdateInfoDto): Promise<IUser> {
    const user = await this.userRepository.findOne({ userId });
    if (!user || !user?.userId) {
      throw new BadRequestException(`${userId} not found`);
    }
    await this.userRepository.updateOne({ userId }, updateDto);

    return this.userRepository.findOne({ userId });
  }

  async sendPasswordResetEmail(resetInput: RequestResetPassword) {
    const user = await this.userRepository.findOne({
      email: resetInput.email,
    });
    if (!user || !user?.userId) {
      throw new BadRequestException(`${resetInput.email} not found`);
    }
    try {
      await this.firebaseClientService
        .auth()
        .sendPasswordResetEmail(resetInput.email);
      return { sent: true };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
