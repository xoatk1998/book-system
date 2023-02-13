import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { AppRepository } from "../../app/app.repository";
import { IBook } from "./books.interface";
import { Book } from "./schemas/book.schema";

@Injectable()
export class BookRepository
  extends AppRepository<IBook>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(Book.name) model: Model<IBook>) {
    super(model);
  }
  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }

  async findByIsbn(isbn: number) {
    return this.findOne({ isbn });
  }
}
