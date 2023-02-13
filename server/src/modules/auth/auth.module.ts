import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../users/user.module";
import { HttpModule } from "@nestjs/axios";
import { FirebaseClientModule } from "../firebaseClient/firebaseClient.module";
import { FirebaseAdminModule } from "@aginix/nestjs-firebase-admin";

@Module({
  imports: [UserModule, HttpModule, FirebaseClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
