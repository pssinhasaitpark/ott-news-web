import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = (data) => API.post('/user/signup', data);
export const login = (data) => API.post('/user/login', data);
export const forgotPasswordEmail = (data) => API.post('/user/password/forgot-email', data);
export const resetPasswordEmail = (data) => API.post('/user/password/reset-email', data);
export const changePassword = (data, token) => API.post('/user/password/change', data, { headers: { Authorization: `Bearer ${token}` } });
export const getMe = (token) => API.get('/user/me', { headers: { Authorization: `Bearer ${token}` } });
export const getMovies = (filters = {}) => API.get("/movies", { params: { ...filters } });
export const saveMovie = (data, token) => API.post('/movies/save', data, { headers: { Authorization: `Bearer ${token}` } });
export const getSavedMovies = (token) => API.get('/movies/saved', { headers: { Authorization: `Bearer ${token}` } });
export const toggleLike = (data, token) => API.post('/like', data, { headers: { Authorization: `Bearer ${token}` } });
export const getLikedMovies = (token) => API.get('/like', { headers: { Authorization: `Bearer ${token}` } });
export const getMoviesLikeCount = (data) => API.post('/like/count', data);
export const getMovieDetails = async (id, token) => { const API_KEY = "34a4ffa6fb5824aee2d46142fd600a43"; const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, { params: { api_key: API_KEY, language: 'en-US', }, }); return response; };
export const getMovieVideos = (movieId) => API.get(`/movies/${movieId}/videos`);
export const getTVShows = (token, filters = {}) => API.get('/tv', { headers: { Authorization: `Bearer ${token}` }, params: { page: 1, ...filters } });
export const saveTVShow = (data, token) => API.post('/tv/save', data, { headers: { Authorization: `Bearer ${token}` } });
export const toggleLikeTVShow = (data, token) => API.post('/like/tv', data, { headers: { Authorization: `Bearer ${token}` } });
export const getTVShowDetails = async (id, token) => { const API_KEY = "34a4ffa6fb5824aee2d46142fd600a43"; const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, { params: { api_key: API_KEY, language: 'en-US', }, }); return response; };
export const getLikedTVShows = (token) => API.get('/like/tv', { headers: { Authorization: `Bearer ${token}` } });
export const getSavedTVShows = (token) => API.get('/tv/saved', { headers: { Authorization: `Bearer ${token}` } });
