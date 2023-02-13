import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpStatus,
  Query,
  HttpCode,
  Res,
} from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from "../../decorators/user.decorator";
// import { JwtPayload } from '../auth/interfaces/payload.interface';
import { BookDto } from "./dto/book.dto";
import { IndexBookFilter } from "./dto/get-book.dto";
import { IPagination } from "../../shared/pagination/pagination.header.interface";
import { Pagination } from "../../decorators/pagination.decorator";
import { setPaginationResponseHeader } from "../../shared/pagination/pagination.helper";
import { ACCESS_TOKEN_HEADER_NAME } from "../../shared/constants";

@ApiTags("book")
@ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
@Controller("books")
// @UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: BookDto,
    description: "Create a book success",
  })
  @ApiOperation({
    operationId: "createBook",
    summary: "Create book",
    description: "Create new book",
  })
  create(@Body() createBookDto: CreateBookDto, @User() userId) {
    return this.booksService.createBook(createBookDto, userId);
  }

  @Get("")
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    type: "Number",
  })
  @ApiQuery({
    name: "perPage",
    required: false,
    description: "Items per page",
    type: "Number",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [BookDto],
    description: "Index books success",
  })
  @ApiOperation({
    operationId: "indexBooks",
    summary: "View all book records",
    description: "View all book records",
  })
  async indexBooks(
    @Pagination() pagination: IPagination,
    @Res() res,
    @Query() filters: IndexBookFilter,
    @User() userId
  ) {
    console.log(filters, "list filters");
    const pagedBooks = await this.booksService.indexBooks(
      filters,
      userId,
      pagination
    );
    return setPaginationResponseHeader(res, pagedBooks);
  }

  @Get(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: BookDto,
    description: "Get book detail",
  })
  @ApiOperation({
    operationId: "getBookDetail",
    summary: "View book records detail",
    description: "View book records detail",
  })
  getBook(@Param("id") id: string, @User() userId) {
    return this.booksService.getBookDetail(id, userId);
  }

  @Put(":id")
  @ApiResponse({
    status: HttpStatus.OK,
    type: BookDto,
    description: "Get book detail",
  })
  @ApiOperation({
    operationId: "updateBook",
    summary: "Update book records",
    description: "Update book records",
  })
  update(
    @Param("id") id: string,
    @Body() updateBookDto: UpdateBookDto,
    @User() userId
  ) {
    return this.booksService.update(id, updateBookDto, userId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: "No Content" })
  @ApiOperation({
    operationId: "deleteBook",
    summary: "Delete book records",
    description: "Delete book records",
  })
  remove(@Param("id") id: string, @User() userId) {
    return this.booksService.removeBook(id, userId);
  }
}
