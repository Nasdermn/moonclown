import mongoose from "mongoose";
import {
  IGenreDocument,
  IMovieDocument,
} from "../utils/interfaces/database.interface";

const genreSchema = new mongoose.Schema<IGenreDocument>({
  name: {
    type: String,
    required: true,
  },
});

const movieSchema = new mongoose.Schema<IMovieDocument>(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    genres: {
      type: [genreSchema],
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    movieLength: {
      type: Number,
      required: true,
    },

    poster: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    movieId: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const movieModel = mongoose.model<IMovieDocument>("movie", movieSchema);
export default movieModel;
