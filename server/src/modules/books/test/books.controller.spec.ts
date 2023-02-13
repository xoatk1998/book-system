import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { AppModule } from "../../../app/app.module";
import { testGlobal } from "../../../shared/testGlobal";
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        BookRepository,
        { provide: getModelToken(Book.name), useValue: jest.fn() },
      ],
    }).compile();

    bookController = module.get<BooksController>(BooksController);
    bookService = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("POST /books", () => {
    beforeEach(() => {
      bookService.createBook = jest.fn().mockReturnValue(createBookResponse);
      jest.setTimeout(30000);
    });
    it(`should create book`, async () => {
      const createBookParam = {
        author: testGlobal.author,
        title: testGlobal.title,
        isbn: testGlobal.isbn,
      };
      const book = await bookController.create(
        createBookParam,
        testGlobal.user
      );

      expect(book).toEqual(createBookResponse);
      expect(bookService.createBook).toBeCalledWith(
        createBookParam,
        testGlobal.user
      );
    });
  });

  describe("DELETE /books/id", () => {
    beforeEach(() => {
      bookService.removeBook = jest.fn().mockReturnValue({});
      jest.setTimeout(30000);
    });
    it(`should remove book`, async () => {
      const book = await bookController.remove(
        testGlobal.recordId,
        testGlobal.user.userId
      );
      console.log(book, "--bok");

      expect(book).toEqual({});
      expect(bookService.removeBook).toBeCalledWith(
        testGlobal.recordId,
        testGlobal.user.userId
      );
    });
  });

  describe("PUT /books/:id", () => {
    beforeEach(() => {
      bookService.update = jest.fn().mockReturnValue(book);
      jest.setTimeout(30000);
    });
    it(`should update book`, async () => {
      const updateBookParams = {
        author: testGlobal.newAuthor,
      };
      const book = await bookController.update(
        testGlobal.recordId,
        updateBookParams,
        testGlobal.user.userId
      );
      expect(book).toEqual(book);
      expect(bookService.update).toBeCalledWith(
        testGlobal.recordId,
        updateBookParams,
        testGlobal.user.userId
      );
    });
  });

  describe("GET /books/:id", () => {
    beforeEach(() => {
      bookService.getBookDetail = jest.fn().mockReturnValue(book);
      jest.setTimeout(30000);
    });
    it(`should update book`, async () => {
      const bookDetail = await bookController.getBook(
        testGlobal.recordId,
        testGlobal.user.userId
      );
      expect(bookDetail).toEqual(book);
      expect(bookService.getBookDetail).toBeCalledWith(
        testGlobal.recordId,
        testGlobal.user.userId
      );
    });
  });

  // describe('GET /books', () => {
  //   beforeEach(() => {
  //     bookService.indexBooks = jest.fn().mockReturnValue({items: [book], headers: []});
  //     jest.setTimeout(30000);
  //   });
  //   it(`should update book`, async () => {
  //     const items = {};
  //     const res: any = {
  //       append: jest.fn(),
  //       json: jest.fn(),
  //     };
  //     const books = await bookController.indexBooks(testGlobal.pagination, {}, res, testGlobal.user);
  //     expect(books).toEqual([book]);
  //     expect(bookService.indexBooks).toBeCalledWith(
  //       {},
  //       testGlobal.user.userId,
  //       testGlobal.pagination
  //     );
  //   });
  // });
});
