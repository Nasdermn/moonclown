interface NamesArray {
  name: string;
}

export interface IMovie {
  id: number;
  name: string;
  type: string;
  year: number;
  genres: NamesArray[];
  country: string;
  movieLength: number;
  poster: string;
}
