import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Put,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RegisterDto } from "./register.dto";
import { AuthService } from "./auth.service";
import {
  LoginDto,
  RefreshTokenDto,
  RequestResetPassword,
  UpdateInfoDto,
} from "./login.dto";
import { User } from "../../decorators/user.decorator";
import { UseResponseDto } from "../users/use.dto";
import { ACCESS_TOKEN_HEADER_NAME } from "../../shared/constants";

@Controller()
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    operationId: "register",
    description: "register",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UseResponseDto,
  })
  @Post("auth/register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    operationId: "login",
    description: "login",
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post("auth/login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: "me",
    description: "me",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UseResponseDto,
  })
  @Get("me")
  me(@User() id: string) {
    return this.authService.me(id);
  }

  @ApiOperation({
    operationId: "logout",
    description: "logout",
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @Post("auth/logout")
  logout(@Headers(ACCESS_TOKEN_HEADER_NAME) token: string) {
    return this.authService.logout(token);
  }

  @ApiOperation({
    operationId: "updateInfo",
    description: "updateInfo",
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @Put("auth/updateInfo")
  updateInfo(@User() id: string, @Body() updateInfoInput: UpdateInfoDto) {
    return this.authService.updateInfo(id, updateInfoInput);
  }

  @ApiOperation({
    operationId: "refreshToken",
    description: "refreshToken",
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post("auth/refreshToken")
  refreshToken(@Body() refreshInput: RefreshTokenDto) {
    return this.authService.refreshToken(refreshInput);
  }

  @ApiOperation({
    operationId: "sendPasswordResetEmail",
    description: "sendPasswordResetEmail",
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post("auth/sendPasswordResetEmail")
  sendPasswordResetEmail(@Body() resetInput: RequestResetPassword) {
    return this.authService.sendPasswordResetEmail(resetInput);
  }
}
