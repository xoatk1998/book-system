import { Module } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Book, BookSchema } from "./schemas/book.schema";
import { BookRepository } from "./books.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
      },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService, BookRepository],
  exports: [BooksService, BookRepository],
})
export class BooksModule {}
