import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, changePassword } from "../api/api";
import { loginSuccess, logout } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import "./Profile.css";

const Profile = () => {
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  const fetchMe = async () => {
    try {
      const { data } = await getMe(token);
      dispatch(loginSuccess({ user: data.data, token }));
    } catch {
      dispatch(logout());
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  fetchMe();
}, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      await changePassword(passwordData, token);
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });
      setShowChangePassword(false);

      const { data } = await getMe(token);
      dispatch(loginSuccess(data.data));
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        dispatch(logout());
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to change password");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="profile-details">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
            <p>
              <strong>Mobile:</strong> {user?.mobile || "N/A"}
            </p>
          </div>
        </div>

        <button
          className="toggle-password-btn"
          onClick={() => setShowChangePassword((prev) => !prev)}
        >
          {showChangePassword ? "Cancel" : "Change Password"}
        </button>

        {showChangePassword && (
          <div className="change-password">
            <h2>Change Password</h2>

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="change-password-btn"
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
