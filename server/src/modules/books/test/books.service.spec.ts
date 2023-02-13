import { HttpStatus } from "@nestjs/common";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { PinoLogger } from "nestjs-pino";
import { AppModule } from "../../../app/app.module";
import { PinoLoggerMock, testGlobal } from "../../../shared/testGlobal";
import { BooksController } from "../books.controller";
import { IBook } from "../books.interface";
import { BooksModule } from "../books.module";
import { BookRepository } from "../books.repository";
import { BooksService } from "../books.service";
import { Book, BookSchema } from "../schemas/book.schema";
import { book, createBookResponse } from "./books.mocks";

describe("BooksController", () => {
  let bookController: BooksController;
  let bookService: BooksService;
  let bookRepository: BookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        BookRepository,
        { provide: getModelToken(Book.name), useValue: jest.fn() },
        PinoLogger
      ],
    })
    .overrideProvider(PinoLogger)
    .useValue(PinoLoggerMock)
    .compile();

    bookController = module.get<BooksController>(BooksController);
    bookService = module.get<BooksService>(BooksService);
    bookRepository = module.get<BookRepository>(BookRepository);

  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("POST /books", () => {
    beforeEach(() => {
      jest.setTimeout(30000);
    });
    // it(`should create book`, async () => {
    //   bookRepository.findByIsbn = jest.fn().mockResolvedValue(null);
    //   bookRepository.create = jest.fn().mockResolvedValue(testGlobal.book);
    //   const result = await bookService.createBook(testGlobal.createBookData, testGlobal.userId);
    //   expect(bookRepository.create).toHaveBeenCalled();
    //   expect(bookRepository.findByIsbn).toHaveBeenCalled();
    //   expect(result).toEqual(testGlobal.book);
    // });

    it(`should throw error when book is exist`, async () => {
      bookRepository.findByIsbn = jest.fn().mockResolvedValue({});
      try {
        const result = await bookService.createBook(testGlobal.createBookData, testGlobal.userId);
      } catch (error) {
        expect(error.response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it(`should throw error if create book fail`, async () => {
      bookRepository.findByIsbn = jest.fn().mockResolvedValue(null);
      bookRepository.create = jest.fn().mockResolvedValue(new Error());
      try {
        const result = await bookService.createBook(testGlobal.createBookData, testGlobal.userId);
      } catch (error) {
        expect(error.response.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
