import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Profile from "./pages/Profile";
import SavedMovies from "./pages/SavedMovies";
import LikedMovies from "./pages/LikedMovies";
import MovieDetails from "./pages/MovieDetails";
import TVShows from "./pages/TVShows";
import TVShowDetails from "./pages/TVShowDetails";
import MyList from "./pages/MyList";
import Loading from './components/Loading';

const App = () => {
  return (
    <>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedMovies />} />
            <Route path="/liked" element={<LikedMovies />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/tv-show/:id" element={<TVShowDetails />} />
            <Route path="/my-list" element={<MyList />} /> 
          </Routes>
        </Suspense>
      </Router>
    </>
  );
};

export default App;