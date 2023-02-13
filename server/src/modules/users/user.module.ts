import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
