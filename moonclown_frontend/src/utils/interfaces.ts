import { ReactNode } from 'react';

export interface IFormValues {
  [key: string]: string;
}

export interface IFormErrors {
  [key: string]: string;
}

interface NamesArray {
  name: string;
}

export interface IApiMovie {
  id: number;
  name: string;
  type: string;
  year: number;
  genres: NamesArray[];
  countries: NamesArray[];
  movieLength: number;
  poster: {
    url: string;
  };
}

export interface ApiResponse {
  docs: IApiMovie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
  message: string[];
}

interface Movie {
  name: string;
  type: string;
  year: number;
  genres: NamesArray[];
  country: string;
  movieLength: number;
  poster: string;
}

export interface IMovie extends Movie {
  id: number;
}

export interface IMovieResult {
  movies: IMovie[];
  page: number;
  pages: number;
}

export interface ILikedMovie extends Movie {
  _id: number;
  movieId: number;
}

export interface IMovieCardProps {
  movieData: IMovie | ILikedMovie;
  isLiked?: boolean;
}

export interface IMoviePosterProps {
  movieData: IMovie | ILikedMovie;
  isOpen: boolean;
  onClose: () => void;
}

export interface ISearchFormProps {
  onSubmit: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface IProtectedElementProps {
  children: ReactNode;
}

export interface IPopupProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDisable?: boolean;
  isBig?: boolean;
}

export interface IChildrenPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IErrorSetter {
  (message: string): void;
}

export interface ISetter {
  (value: boolean): void;
}
