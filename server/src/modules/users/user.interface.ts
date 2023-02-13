import { BaseDocument } from "../../shared/mongoose";

export interface IUser extends BaseDocument {
  userId: string;
  name: string;
  email: string;
}
