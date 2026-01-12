import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/userSlice";
import AuthModal from "./AuthModal";
import "./Navbar.css";
import { closeAuthModal, openAuthModal } from "../store/slices/uiSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { showAuthModal, redirectPath } = useSelector((state) => state.ui);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand-logo">
            🎬 MovieFlix
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/movies" className="nav-link">
            Movies
          </Link>
          <Link to="/tv-shows" className="nav-link">
            TV Shows
          </Link>
          <Link
            to="/my-list"
            className="nav-link"
            onClick={(e) => {
              if (!user) {
                e.preventDefault();
                dispatch(openAuthModal(location.pathname));
              }
            }}
          >
            My List
          </Link>
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <div
                className="user-avatar"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {showDropdown && (
                <div className="user-dropdown">
                  <Link to="/profile">Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="sign-in-btn"
              onClick={() => dispatch(openAuthModal())}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal
          onClose={() => {
            dispatch(closeAuthModal());
            if (redirectPath) navigate(redirectPath);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
