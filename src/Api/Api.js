import axios from 'axios';

const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDQyYWFhZGIwOWExZjUxNWY3YzMzNTVmZTdjZmZmZSIsIm5iZiI6MTc1MjkwMDAyNC4yLCJzdWIiOiI2ODdiMjFiODIwZTUxZDYxYjcyNDNlY2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Lyi7NGnW3K18uPQQobpaa72TfoICBNlOIklikdfiHK8';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const getMovie = async (page = 1) => {
  try {
    const response = await api.get(`/3/discover/movie?page=${page}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTv = async (page = 1) => {
  try {
    const response = await api.get(`/3/discover/tv?page=${page}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getWatchProviders = async (movieId, type = 'movie') => {
  try {
    const endpoint =
      type === 'movie'
        ? `/3/movie/${movieId}/watch/providers`
        : `/3/tv/${movieId}/watch/providers`;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getMovieVideos = async (movieId, type = 'movie') => {
  try {
    const endpoint =
      type === 'movie'
        ? `/3/movie/${movieId}/videos?language=en-US`
        : `/3/tv/${movieId}/videos?language=en-US`;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const searchMovies = async (query, page = 1, year = null) => {
  try {
    let endpoint = `/3/search/movie?query=${encodeURIComponent(
      query,
    )}&include_adult=true&language=en-US&page=${page}&region=us`;

    if (year) {
      endpoint += `&primary_release_year=${year}&year=${year}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const searchTv = async (query, page = 1, year = null) => {
  try {
    let endpoint = `/3/search/tv?query=${encodeURIComponent(
      query,
    )}&include_adult=true&language=en-US&page=${page}&region=us`;

    if (year) {
      endpoint += `&first_air_date_year=${year}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await api.get(
      `/3/movie/now_playing?language=en-US&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getPopularMovies = async (page = 1) => {
  try {
    const response = await api.get(
      `/3/movie/popular?language=en-US&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await api.get(
      `/3/movie/top_rated?language=en-US&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await api.get(
      `/3/movie/upcoming?language=en-US&page=${page}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default {
  getMovie,
  getTv,
  getWatchProviders,
  getMovieVideos,
  searchMovies,
  searchTv,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
};
