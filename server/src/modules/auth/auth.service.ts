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

  async login(loginDto: LoginDto): Promise<LoginResponse> {
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
      throw new UnauthorizedException(e.message);
    }
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
