import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";
import { ConfigModule } from "../config/config.module";
import { BooksModule } from "../books/books.module";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }]),
    BooksModule
  ],
  providers: [UserService, UserRepository ],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
