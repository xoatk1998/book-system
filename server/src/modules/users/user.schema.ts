import { getBaseSchema } from "../../shared/mongoose";
import { IUser } from "./user.interface";
const UserSchema = getBaseSchema<IUser>();

UserSchema.add({
  userId: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
});

export { UserSchema };
