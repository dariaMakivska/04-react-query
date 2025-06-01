import axios from 'axios';
import type { Movie } from '../types/movie';

interface MovieApiResponse {
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies(query: string, token: string, page: number): Promise<MovieApiResponse> {
  const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

  const response = await axios.get<MovieApiResponse>(BASE_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}