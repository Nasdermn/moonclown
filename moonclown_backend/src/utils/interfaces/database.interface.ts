import { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface IUserModel extends Model<IUserDocument> {
  findUserByCredentials(
    email: string,
    password: string
  ): Promise<IUserDocument>;
}

export interface IGenreDocument extends Document {
  name: string;
}

export interface IMovieDocument extends Document {
  name: string;
  type: string;
  year: number;
  genres: IGenreDocument[];
  country: string;
  movieLength: number;
  poster: string;
  owner: Schema.Types.ObjectId;
  movieId: number;
}

export interface ICodeDocument extends Document {
  email: string;
  code: string;
  nextSendAllowedAt: Date;
  createdAt: Date;
}
