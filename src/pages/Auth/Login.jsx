import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/api";
import { loginSuccess } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ mobile: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await login(formData);

    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    dispatch(
      loginSuccess({
        user: data.data.user,
        token: data.data.token,
      })
    );

    toast.success("Login successful!");
    navigate("/", { replace: true });
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>

        <input
          type="text"
          placeholder="Mobile Number"
          className="login-input"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>

        <div className="login-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/signup">Create Account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
