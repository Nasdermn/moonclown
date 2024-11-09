import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import {
  IUserDocument,
  IUserModel,
} from "../utils/interfaces/database.interface";

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 74,
    },

    password: {
      type: String,
      required: true,
      select: false,
      maxlength: 60,
    },

    avatar: {
      type: String,
      default: "default.png",
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

userSchema.statics.findUserByCredentials = function (
  email: string,
  password: string
) {
  return this.findOne({ email })
    .select("+password")
    .orFail(() => {
      throw new UnauthorizedError("Email или пароль введен(ы) неправильно.");
    })
    .then((user: IUserDocument | null) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Email или пароль введен(ы) неправильно.")
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Email или пароль введен(ы) неправильно.")
          );
        }
        return user;
      });
    });
};

const userModel = mongoose.model<IUserDocument, IUserModel>("user", userSchema);
export default userModel;
