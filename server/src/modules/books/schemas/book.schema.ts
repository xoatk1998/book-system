import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BookDocument = Book & Document;

@Schema({
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
})
export class Book {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  isbn: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
