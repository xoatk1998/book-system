import { HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./errors.dto";

export const BASE_ERROR_CODE = "03";
const GROUP_ERROR_CODE = "03";

const getErrorCode = (code) => `${BASE_ERROR_CODE}${GROUP_ERROR_CODE}${code}`;

export const Errors = {
  LOGIN_INFO_INCORRECT: {
    message: "Username or password is incorrect.",
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: getErrorCode(ErrorCode.LOGIN_INFO_INCORRECT),
  },
  INCORRECT_TOKEN: {
    message: "Token incorrect",
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: getErrorCode(ErrorCode.INCORRECT_TOKEN),
  },
  EXIST_BOOK: {
    message: "An book was created with same isbn",
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: getErrorCode(ErrorCode.EXIST_BOOK),
  },
  BOOK_NOT_FOUND: {
    message: "Book not found",
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: getErrorCode(ErrorCode.BOOK_NOT_FOUND),
  },
  INTERNAL_SERVER_ERROR: {
    message: "Something went wrong. Please try again",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: getErrorCode(ErrorCode.INTERNAL_SERVER_ERROR),
  },
};
