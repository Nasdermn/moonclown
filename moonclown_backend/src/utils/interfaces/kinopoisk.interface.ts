interface NamesArray {
  name: string;
}

interface IApiMovie {
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
