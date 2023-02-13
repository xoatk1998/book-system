import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { getHeaders } from "../../shared/pagination/pagination.helper";
import { Errors } from "../../errors/errors";
import { IPagination } from "../../shared/pagination/pagination.header.interface";
import { BookRepository } from "./books.repository";
import { CreateBookDto } from "./dto/create-book.dto";
import { IndexBookFilter } from "./dto/get-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Book, BookDocument } from "./schemas/book.schema";
import { Logger, PinoLogger } from "nestjs-pino";

@Injectable()
export class BooksService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly logger: PinoLogger
  ) {}

  async createBook(createBookDto: CreateBookDto, userId: string): Promise<BookDocument> {
    const existBook = await this.bookRepository.findByIsbn(+createBookDto.isbn);
    if (existBook) {
      throw new BadRequestException(Errors.EXIST_BOOK);
    }
    try {
      return this.bookRepository.create({
        ...createBookDto,
        userId: userId
      });
    } catch (error) {
      this.logger.error("BooksService::createBook error", error);
      throw new InternalServerErrorException(Errors.INTERNAL_SERVER_ERROR)
    }
  }

  async indexBooks(
    filters: IndexBookFilter,
    userId: string,
    pagination: IPagination
  ) {

    const condition = {
      sort: {
        _id: -1
      },
      limit: pagination.perPage,
      skip: pagination.startIndex
    }
    const books = await this.bookRepository
      .find({ ...filters, userId }, condition)
    if (!books.length) {
      throw new NotFoundException(Errors.BOOK_NOT_FOUND);
    }

    const booksCount = await this.bookRepository.count({ ...filters, userId });
    const responseHeaders = getHeaders(pagination, booksCount);

    return {
      items: books,
      headers: responseHeaders
    }
  }

  async getBookDetail(transactionId: string, userId: string) {
    const book = await this.bookRepository.findOne({ _id: transactionId, userId });
    if (!book) {
      throw new NotFoundException(Errors.BOOK_NOT_FOUND);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto, userId: string) {
    try {
      await this.getBookDetail(id, userId);
      return this.bookRepository.updateOne(
        { _id: id },
        { $set: updateBookDto }
      );
    } catch (error) {
      this.logger.error("BooksService::update error", error);
      throw new InternalServerErrorException(Errors.INTERNAL_SERVER_ERROR)
    }
  }

  async removeBook(id: string, userId: string) {
    try {
      await this.getBookDetail(id, userId);
      const removeSuccess = await this.bookRepository.deleteOne({_id: id});
      return !!removeSuccess;
    } catch (error) {
      this.logger.error("BooksService::removeBook error", error);
      throw new InternalServerErrorException(Errors.INTERNAL_SERVER_ERROR)
    }
  }
}
