import { Document } from "mongoose";

export interface IBook extends Document {
  id?: string;
  title: string;
  author: string;
  isbn: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
