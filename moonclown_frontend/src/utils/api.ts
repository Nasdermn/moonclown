import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { MAIN_API_URL } from './constants';
import { IMovie, IApiMovie, IMovieResult } from './interfaces';
import useCurrentUser from '../stores/currentUser';

class Api {
  private mainApi: AxiosInstance;

  constructor() {
    this.mainApi = axios.create({
      baseURL: MAIN_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.mainApi.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          const setLoggedIn = useCurrentUser.getState().setLoggedIn;
          const setLogoutReason = useCurrentUser.getState().setLogoutReason;
          setLoggedIn(false);
          setLogoutReason('Ваш jwt-токен истёк');
          localStorage.removeItem('jwt');
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken() {
    return localStorage.getItem('jwt');
  }

  private responseHandler(res: AxiosResponse) {
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      throw new Error(
        JSON.stringify({
          status: res.status,
          message: res.data ? res.data.message : 'Произошла ошибка',
        })
      );
    }
  }

  public signup(name: string, email: string, password: string) {
    return this.mainApi.post('/auth/signup', { name, email, password });
  }

  public signin(email: string, password: string) {
    return this.mainApi.post('/auth/signin', { email, password }).then((res) => {
      if (res.status === 200 && res.data.token) {
        localStorage.setItem('jwt', res.data.token);
        return this.getUser();
      }
    });
  }

  public sendCode(email: string) {
    return this.mainApi.post('/mail/code/send', { email }).then(this.responseHandler);
  }

  public checkCode(email: string, code: string) {
    return this.mainApi.post('/mail/code/check', { email, code }).then(this.responseHandler);
  }

  public sendMessage(email: string, name: string, message: string) {
    return this.mainApi.post('/mail/message', { email, name, message }).then(this.responseHandler);
  }

  public recoverPassword(email: string) {
    return this.mainApi.post('/password/recover', { email }).then(this.responseHandler);
  }

  public checkLink(id: string, token: string) {
    return this.mainApi.get(`/password/check/${id}/${token}`).then(this.responseHandler);
  }

  public updatePassword(id: string, token: string, password: string) {
    return this.mainApi
      .post(`/password/update/${id}/${token}`, { password })
      .then(this.responseHandler);
  }

  public getUser() {
    const token = this.getToken();
    return this.mainApi
      .get('/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(this.responseHandler);
  }

  public patchName(name: string) {
    const token = this.getToken();
    return this.mainApi
      .patch(
        '/users/me/name',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(this.responseHandler);
  }

  public patchAvatar(formData: FormData) {
    const token = this.getToken();
    return this.mainApi
      .patch('/users/me/avatar', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(this.responseHandler);
  }

  public patchPassword(oldPassword: string, newPassword: string) {
    const token = this.getToken();
    return this.mainApi
      .patch(
        '/users/me/password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(this.responseHandler);
  }

  public saveMovie(movie: IMovie) {
    const token = this.getToken();
    return this.mainApi
      .post('/movies', movie, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(this.responseHandler);
  }

  public getSavedMovies() {
    const token = this.getToken();
    return this.mainApi
      .get('/movies', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(this.responseHandler);
  }

  public deleteSavedMovie(id: number) {
    const token = this.getToken();
    return this.mainApi
      .delete(`/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(this.responseHandler);
  }

  public getMovies(searchQuery: string, page: number, reverse?: boolean): Promise<IMovieResult> {
    const token = this.getToken();
    return this.mainApi
      .post(
        '/kinopoisk',
        { searchQuery, page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(this.responseHandler)
      .then(({ docs, page, pages }) => {
        const movies = (docs as IApiMovie[]).reduce<IMovie[]>((result, movie) => {
          const posterUrl = movie.poster?.url;
          const countryName = movie.countries?.[0]?.name;
          if (
            movie.id &&
            movie.name &&
            movie.type &&
            movie.year &&
            movie.movieLength &&
            posterUrl &&
            movie.genres?.length > 0 &&
            countryName
          ) {
            result.push({
              id: movie.id,
              name: movie.name,
              type: movie.type,
              year: movie.year,
              movieLength: movie.movieLength,
              poster: posterUrl,
              genres: movie.genres,
              country: countryName,
            });
          }
          return result;
        }, []);
        if (movies.length > 0 || pages <= 1) {
          return { movies, page, pages };
        } else if (reverse) {
          return page > 1 ? this.getMovies(searchQuery, --page, true) : { movies, page: 1, pages };
        } else {
          return page < pages
            ? this.getMovies(searchQuery, ++page)
            : { movies, page: pages, pages };
        }
      });
  }
}

export default new Api();
